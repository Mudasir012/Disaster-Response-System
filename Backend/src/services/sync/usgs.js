import { config } from '../../config/index.js'
import { RawEvent } from '../../models/RawEvent.js'

export async function fetchUSGS() {
  console.log('[USGS] Fetching earthquakes...')

  const res = await fetch(config.usgsApiUrl, {
    headers: { 'User-Agent': config.userAgent },
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    console.warn(`[USGS] HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  const events = []

  for (const feature of data.features || []) {
    const props = feature.properties
    const coords = feature.geometry.coordinates
    const sourceEventId = `usgs-${props.net || 'us'}-${props.code || props.id}`

    events.push({
      source: 'usgs',
      source_event_id: sourceEventId,
      raw_text: `${props.title || 'Earthquake'}. Mag ${props.mag}. Depth ${coords?.[2]?.toFixed(1)}km.`,
      raw_payload: { ...props, coordinates: coords },
      fetched_at: new Date(),
    })
  }

  console.log(`[USGS] Found ${events.length} events`)

  for (const event of events) {
    try {
      await RawEvent.findOneAndUpdate(
        { source_event_id: event.source_event_id, source: 'usgs' },
        event,
        { upsert: true, timestamps: false }
      )
    } catch (err) {
      console.error(`[USGS] Upsert error:`, err.message)
    }
  }

  return events
}
