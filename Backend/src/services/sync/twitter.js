import { config } from '../../config/index.js'
import { RawEvent } from '../../models/RawEvent.js'

export async function fetchTwitter() {
  if (!config.twitterBearerToken) {
    console.log('[Twitter] No bearer token configured, skipping')
    return []
  }

  console.log('[Twitter] Searching recent tweets...')

  const url = `${config.twitterApiUrl}?query=${encodeURIComponent(config.twitterQuery)}&max_results=50&tweet.fields=created_at,geo`

  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${config.twitterBearerToken}`, 'User-Agent': config.userAgent },
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    console.warn(`[Twitter] HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  const events = []

  for (const tweet of data.data || []) {
    events.push({
      source: 'twitter',
      source_event_id: `twitter-${tweet.id}`,
      raw_text: tweet.text || '',
      raw_payload: tweet,
      fetched_at: new Date(),
    })
  }

  console.log(`[Twitter] Found ${events.length} tweets`)

  for (const event of events) {
    try {
      await RawEvent.findOneAndUpdate(
        { source_event_id: event.source_event_id, source: 'twitter' },
        event,
        { upsert: true, timestamps: false }
      )
    } catch (err) {
      console.error(`[Twitter] Upsert error:`, err.message)
    }
  }

  return events
}
