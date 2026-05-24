import { RawEvent } from '../../models/RawEvent.js'
import { createHash } from 'crypto'

function urlToId(url) {
  return createHash('sha256').update(url).digest('hex').slice(0, 16)
}

export async function fetchGDELT() {
  console.log('[GDELT] Fetching articles...')

  const query = 'disaster OR earthquake OR flood OR wildfire OR cyclone OR tsunami'
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=50&timespan=15min&format=json`

  const res = await fetch(url, {
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    console.warn(`[GDELT] HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  const articles = data.articles || []
  const events = []

  for (const article of articles) {
    events.push({
      source: 'gdelt',
      source_event_id: `gdelt-${urlToId(article.url)}`,
      raw_text: article.title || '',
      raw_payload: article,
      fetched_at: new Date(),
    })
  }

  console.log(`[GDELT] Found ${events.length} articles`)

  for (const event of events) {
    try {
      await RawEvent.findOneAndUpdate(
        { source_event_id: event.source_event_id, source: 'gdelt' },
        event,
        { upsert: true, timestamps: false }
      )
    } catch (err) {
      console.error(`[GDELT] Upsert error:`, err.message)
    }
  }

  return events
}
