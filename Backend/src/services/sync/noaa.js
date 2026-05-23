import { config } from '../../config/index.js'
import { RawEvent } from '../../models/RawEvent.js'

export async function fetchNOAA() {
  console.log('[NOAA] Fetching alerts...')

  const res = await fetch(config.noaaApiUrl, {
    headers: { 'Accept': 'application/geo+json', 'User-Agent': config.userAgent },
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    console.warn(`[NOAA] HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  const events = []

  for (const feature of data.features || []) {
    const props = feature.properties
    const sourceEventId = `noaa-${props.id || props.atomId || ''}`.replace(/[^a-zA-Z0-9-]/g, '-')

    events.push({
      source: 'noaa',
      source_event_id: sourceEventId,
      raw_text: `${props.event || 'Weather alert'}: ${props.headline || ''}. ${props.description || ''}`.slice(0, 1000),
      raw_payload: props,
      fetched_at: new Date(),
    })
  }

  console.log(`[NOAA] Found ${events.length} events`)

  for (const event of events) {
    try {
      await RawEvent.findOneAndUpdate(
        { source_event_id: event.source_event_id, source: 'noaa' },
        event,
        { upsert: true, timestamps: false }
      )
    } catch (err) {
      console.error(`[NOAA] Upsert error:`, err.message)
    }
  }

  return events
}
