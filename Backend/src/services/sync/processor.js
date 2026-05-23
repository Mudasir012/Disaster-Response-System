import { Worker } from 'bullmq'
import { connection, queues } from '../queue.js'
import { fetchGDACS } from './gdacs.js'
import { fetchUSGS } from './usgs.js'
import { fetchNOAA } from './noaa.js'
import { fetchNewsAPI } from './newsapi.js'
import { fetchTwitter } from './twitter.js'
import { processIncidentWithAI, extractLocationFromText, logAIProcessing } from '../ai/claude.js'
import { geocodeLocation, getContinent } from '../geocode.js'
import { Incident } from '../../models/Incident.js'
import { RawEvent } from '../../models/RawEvent.js'
import { severityLabel } from '../../utils/helpers.js'
import { config } from '../../config/index.js'

let io = null

export function setSocketIO(socketIO) {
  io = socketIO
}

const fetchers = {
  gdacs: fetchGDACS,
  usgs: fetchUSGS,
  noaa: fetchNOAA,
  newsapi: fetchNewsAPI,
  twitter: fetchTwitter,
}

function normalizeEventType(raw) {
  const map = {
    earthquake: 'earthquake', flood: 'flood', 'flash flood': 'flood',
    wildfire: 'wildfire', 'wild fire': 'wildfire', bushfire: 'wildfire',
    cyclone: 'cyclone', hurricane: 'cyclone', typhoon: 'cyclone',
    tsunami: 'tsunami', tornado: 'severe_weather',
    'severe weather': 'severe_weather', storm: 'severe_weather',
  }
  return map[raw?.toLowerCase()] || 'severe_weather'
}

async function processRawEvent(rawEvent) {
  if (rawEvent.processed) return null

  try {
    const aiResult = await processIncidentWithAI(rawEvent.raw_text)

    await logAIProcessing(rawEvent._id, {
      prompt_tokens: aiResult.usage?.input_tokens || 0,
      completion_tokens: aiResult.usage?.output_tokens || 0,
      duration_ms: aiResult.duration,
      success: true,
      result_summary: `SEV-${aiResult.severity} ${aiResult.event_type}, ${aiResult.location_name}`,
    })

    let lat = rawEvent.raw_payload?.coordinates?.[1] ||
              rawEvent.raw_payload?.lat ||
              rawEvent.raw_payload?.latitude
    let lng = rawEvent.raw_payload?.coordinates?.[0] ||
              rawEvent.raw_payload?.lng ||
              rawEvent.raw_payload?.longitude

    if (!lat || !lng) {
      const geo = await geocodeLocation(aiResult.location_name)
      if (geo) {
        lat = geo.lat
        lng = geo.lng
      }
    }

    if (!lat || !lng) return null

    const eventType = normalizeEventType(aiResult.event_type)

    const incidentData = {
      event_type: eventType,
      location: {
        name: aiResult.location_name,
        lat, lng,
        continent: getContinent(lat, lng),
      },
      severity: aiResult.severity,
      severity_label: severityLabel(aiResult.severity),
      summary: aiResult.summary,
      ai_confidence: aiResult.confidence,
      stats: {
        magnitude: rawEvent.raw_payload?.mag || null,
        depth_km: rawEvent.raw_payload?.coordinates?.[2] || null,
      },
      source_count: 1,
      status: 'active',
      first_seen: new Date(),
      last_updated: new Date(),
    }

    const incident = await Incident.findOneAndUpdate(
      {
        'location.lat': { $near: lat },
        'location.lng': { $near: lng },
        event_type: eventType,
        created_at: { $gte: new Date(Date.now() - 3600000) },
      },
      { $inc: { source_count: 1 }, last_updated: new Date() },
      { sort: { created_at: -1 }, new: true }
    )

    let newIncident = null

    if (incident) {
      incident.sources.push(rawEvent._id)
      await incident.save()
      rawEvent.incident_id = incident._id
    } else {
      const created = await Incident.create(incidentData)
      created.sources = [rawEvent._id]
      await created.save()
      rawEvent.incident_id = created._id
      newIncident = created
    }

    rawEvent.processed = true
    rawEvent.processed_at = new Date()
    await rawEvent.save()

    if (newIncident && io) {
      io.emit('new_incident', newIncident.toObject())
    }

    return newIncident || incident
  } catch (err) {
    console.error(`[Processor] Error processing ${rawEvent._id}:`, err.message)

    await logAIProcessing(rawEvent._id, {
      prompt_tokens: 0,
      completion_tokens: 0,
      duration_ms: 0,
      success: false,
      error: err.message,
      result_summary: 'Processing failed',
    })

    return null
  }
}

export function startWorkers() {
  console.log('[Worker] Starting queue workers...')

  Object.entries(queues).forEach(([name, queue]) => {
    new Worker(name, async (job) => {
      const { source } = job.data
      console.log(`[Worker] Processing ${name} sync job`)

      const fetcher = fetchers[name]
      if (!fetcher) {
        console.warn(`[Worker] No fetcher for ${name}`)
        return
      }

      const rawEvents = await fetcher()

      for (const rawEvent of rawEvents) {
        const found = await RawEvent.findOne({
          source_event_id: rawEvent.source_event_id,
          source: rawEvent.source,
        })
        if (found && !found.processed) {
          await processRawEvent(found)
        }
      }

      if (io) {
        const active = await Incident.countDocuments({ status: 'active' })
        const today = await Incident.countDocuments({
          created_at: { $gte: new Date().setHours(0, 0, 0, 0) },
        })
        const critical = await Incident.countDocuments({ severity: 5, status: 'active' })
        const countries = (await Incident.distinct('location.country', { status: 'active' })).length
        io.emit('stats_update', { active, today, critical, countries })
      }
    }, { connection, concurrency: 2 })
  })
}
