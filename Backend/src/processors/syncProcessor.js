import fetchGDELT from '../workers/gdeltWorker.js'
import fetchUSGS from '../workers/usgsWorker.js'
import fetchGDACS from '../workers/gdacsWorker.js'
import fetchNOAA from '../workers/noaaWorker.js'
import normalize from '../pipeline/normalizer.js'
import isDuplicate from '../pipeline/deduplicator.js'
import processWithAI from '../pipeline/aiProcessor.js'
import geocode from '../pipeline/geocoder.js'
import buildIncident from '../pipeline/incidentBuilder.js'
import { RawEvent } from '../models/RawEvent.js'
import logger from '../utils/logger.js'

const fetchers = {
  gdelt: fetchGDELT,
  usgs: fetchUSGS,
  gdacs: fetchGDACS,
  noaa: fetchNOAA,
}

export default async function processSyncJob(job) {
  const { source } = job.data
  const fetcher = fetchers[source]

  if (!fetcher) {
    logger.warn(`Unknown source: ${source}`)
    return { processed: 0, source }
  }

  logger.info(`[SyncProcessor] Fetching ${source}...`)
  const rawEvents = await fetcher()
  let newCount = 0

  for (const raw of rawEvents) {
    try {
      const duplicate = await isDuplicate(source, raw.event_id)
      if (duplicate) continue

      const rawEventDoc = await RawEvent.create({
        source,
        source_event_id: raw.event_id,
        raw_text: raw.raw_text,
        raw_payload: raw.raw_payload,
        processed: false,
        fetched_at: new Date(),
      })

      const normalised = normalize(raw)

      const aiResult = await processWithAI(normalised)

      const geoResult = await geocode(
        aiResult.location_name,
        normalised.lat,
        normalised.lng
      )

      if (!geoResult.lat || !geoResult.lng) {
        logger.warn(`[SyncProcessor] Could not geocode ${aiResult.location_name}, skipping`)
        continue
      }

      await buildIncident(aiResult, geoResult, normalised, rawEventDoc)
      newCount++
    } catch (err) {
      logger.error(`[SyncProcessor] Error processing ${source} event: ${err.message}`)
    }
  }

  logger.info(`[SyncProcessor] ${source}: ${newCount} new incidents from ${rawEvents.length} raw events`)
  return { processed: newCount, total: rawEvents.length, source }
}
