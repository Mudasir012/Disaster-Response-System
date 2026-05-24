import hashUrl from '../utils/hashUrl.js'
import parseGDELTDate from '../utils/parseGDELTDate.js'

export default async function fetchGDELT() {
  const query = 'earthquake OR flood OR wildfire OR cyclone OR tsunami OR hurricane OR tornado'
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=50&timespan=15min&format=json&sourcelang=english`

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) {
    console.warn(`[GDELT] HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  const articles = data.articles || []

  return articles.map((article) => ({
    source: 'gdelt',
    event_id: hashUrl(article.url),
    raw_text: article.title || '',
    raw_payload: article,
    timestamp: parseGDELTDate(article.seendate),
    url: article.url,
    domain: article.domain,
  }))
}
