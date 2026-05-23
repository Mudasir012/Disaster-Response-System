import { config } from '../../config/index.js'
import { RawEvent } from '../../models/RawEvent.js'

export async function fetchNewsAPI() {
  if (!config.newsApiKey) {
    console.log('[NewsAPI] No API key configured, skipping')
    return []
  }

  console.log('[NewsAPI] Fetching news...')

  const url = `${config.newsApiUrl}?q=${encodeURIComponent(config.newsApiQuery)}&language=en&sortBy=publishedAt&pageSize=50`

  const res = await fetch(url, {
    headers: { 'X-Api-Key': config.newsApiKey, 'User-Agent': config.userAgent },
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    console.warn(`[NewsAPI] HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  const events = []

  for (const article of data.articles || []) {
    const sourceEventId = `newsapi-${encodeURIComponent(article.url || article.title || '')}`.slice(0, 128)

    events.push({
      source: 'newsapi',
      source_event_id: sourceEventId,
      raw_text: `${article.title || ''}. ${article.description || ''}`.slice(0, 1000),
      raw_payload: article,
      fetched_at: new Date(),
    })
  }

  console.log(`[NewsAPI] Found ${events.length} articles`)

  for (const event of events) {
    try {
      await RawEvent.findOneAndUpdate(
        { source_event_id: event.source_event_id, source: 'newsapi' },
        event,
        { upsert: true, timestamps: false }
      )
    } catch (err) {
      console.error(`[NewsAPI] Upsert error:`, err.message)
    }
  }

  return events
}
