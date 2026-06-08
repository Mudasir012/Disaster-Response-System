import { XMLParser } from 'fast-xml-parser'
import hashUrl from '../utils/hashUrl.js'

const parser = new XMLParser({ ignoreAttributes: false })

export default async function fetchGDACS() {
  const url = 'https://www.gdacs.org/xml/rss.xml'

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) {
    console.warn(`[GDACS] HTTP ${res.status}`)
    return []
  }

  const xml = await res.text()
  const parsed = parser.parse(xml)
  const items = parsed?.rss?.channel?.item || []

  return items.map((item) => {
    let lat = null
    let lng = null
    const geoLat = item['geo:lat']
    const geoLong = item['geo:long']
    if (geoLat && geoLong) {
      lat = parseFloat(geoLat)
      lng = parseFloat(geoLong)
    }

    return {
      source: 'gdacs',
      event_id: hashUrl(item.link || ''),
      raw_text: `${item.title || ''}. ${item.description || ''}`,
      raw_payload: item,
      timestamp: new Date(item.pubDate || Date.now()),
      lat,
      lng,
    }
  })
}
