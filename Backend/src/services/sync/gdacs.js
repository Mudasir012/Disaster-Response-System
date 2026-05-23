import { config } from '../../config/index.js'
import { RawEvent } from '../../models/RawEvent.js'

export async function fetchGDACS() {
  console.log('[GDACS] Fetching incidents...')

  const res = await fetch(config.gdacsApiUrl, {
    headers: { 'Accept': 'application/json', 'User-Agent': config.userAgent },
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    console.warn(`[GDACS] HTTP ${res.status}`)
    return []
  }

  const text = await res.text()
  const matches = text.matchAll(/<item>([\s\S]*?)<\/item>/g)
  const events = []

  for (const match of matches) {
    const item = match[1]
    const title = item.match(/<title>(.*?)<\/title>/)?.[1] || ''
    const description = item.match(/<description>(.*?)<\/description>/)?.[1] || ''
    const guid = item.match(/<guid>(.*?)<\/guid>/)?.[1] || ''
    if (!guid) continue

    const sourceEventId = `gdacs-${guid.replace(/[^a-zA-Z0-9]/g, '-')}`

    events.push({
      source: 'gdacs',
      source_event_id: sourceEventId,
      raw_text: `${title}. ${description}`,
      raw_payload: { title, description, guid },
      fetched_at: new Date(),
    })
  }

  console.log(`[GDACS] Found ${events.length} events`)

  for (const event of events) {
    try {
      await RawEvent.findOneAndUpdate(
        { source_event_id: event.source_event_id, source: 'gdacs' },
        event,
        { upsert: true, timestamps: false }
      )
    } catch (err) {
      console.error(`[GDACS] Upsert error:`, err.message)
    }
  }

  return events
}
