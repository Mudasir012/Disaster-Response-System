const continentMap = {
  'north america': 'Americas',
  'south america': 'Americas',
  'united states': 'Americas',
  'canada': 'Americas',
  'mexico': 'Americas',
  'brazil': 'Americas',
  'argentina': 'Americas',
  'chile': 'Americas',
  'colombia': 'Americas',
  'peru': 'Americas',
  'europe': 'Europe',
  'united kingdom': 'Europe',
  'germany': 'Europe',
  'france': 'Europe',
  'italy': 'Europe',
  'spain': 'Europe',
  'russia': 'Europe',
  'asia': 'Asia',
  'china': 'Asia',
  'india': 'Asia',
  'japan': 'Asia',
  'turkey': 'Asia',
  'indonesia': 'Asia',
  'pakistan': 'Asia',
  'bangladesh': 'Asia',
  'philippines': 'Asia',
  'thailand': 'Asia',
  'iran': 'Asia',
  'africa': 'Africa',
  'nigeria': 'Africa',
  'kenya': 'Africa',
  'south africa': 'Africa',
  'ethiopia': 'Africa',
  'australia': 'Oceania',
  'new zealand': 'Oceania',
  'oceania': 'Oceania',
  'antarctica': 'Antarctica',
}

function getContinent(country) {
  if (!country) return 'Unknown'
  return continentMap[country.toLowerCase()] || 'Unknown'
}

import { Incident } from '../models/Incident.js'
import { RawEvent } from '../models/RawEvent.js'
import severityLabel from '../utils/severityLabel.js'
import alertQueue from '../queues/alertQueue.js'
import { AlertSubscription } from '../models/AlertSubscription.js'
import { emitNewIncident } from '../socket.js'

export default async function buildIncident(aiResult, geoResult, normalisedEvent, rawEventDoc) {
  const eventType = aiResult.event_type === 'unknown' ? 'tornado' : aiResult.event_type

  const incidentData = {
    event_type: eventType,
    location: {
      name: aiResult.location_name || 'Unknown',
      lat: geoResult.lat,
      lng: geoResult.lng,
      continent: getContinent(aiResult.location_name),
    },
    severity: aiResult.severity,
    severity_label: severityLabel(aiResult.severity),
    summary: aiResult.summary,
    ai_confidence: aiResult.ai_confidence,
    stats: {},
    source_count: 1,
    status: aiResult.ai_confidence < parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || '0.7') ? 'monitoring' : 'active',
    first_seen: new Date(),
    last_updated: new Date(),
  }

  if (normalisedEvent.meta?.magnitude != null) {
    incidentData.stats.magnitude = normalisedEvent.meta.magnitude
    incidentData.stats.depth_km = normalisedEvent.meta.depth_km
  }

  const incident = await Incident.create(incidentData)
  incident.sources = [rawEventDoc._id]
  await incident.save()

  rawEventDoc.incident_id = incident._id
  rawEventDoc.processed = true
  rawEventDoc.processed_at = new Date()
  await rawEventDoc.save()

  const obj = incident.toObject()
  emitNewIncident(obj)

  if (aiResult.severity >= 4) {
    try {
      const subscriptions = await AlertSubscription.find({ confirmed: true })
      for (const sub of subscriptions) {
        for (const rule of sub.rules) {
          const regionMatch = rule.region === 'worldwide' ||
            rule.region?.toLowerCase() === (incidentData.location.continent || '').toLowerCase() ||
            rule.region?.toLowerCase() === (aiResult.location_name || '').toLowerCase()

          const typeMatch = !rule.event_types || rule.event_types.length === 0 ||
            rule.event_types.includes(eventType)

          const severityMatch = aiResult.severity >= (rule.min_severity || 1)

          if (regionMatch && typeMatch && severityMatch) {
            await alertQueue.add('send-alert', {
              incident: obj,
              subscription_email: sub.email,
              rule,
            })
          }
        }
      }
    } catch (err) {
      console.error('[IncidentBuilder] Alert check error:', err.message)
    }
  }

  return incident
}
