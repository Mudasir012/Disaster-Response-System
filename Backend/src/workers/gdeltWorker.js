import hashUrl from '../utils/hashUrl.js'
import parseGDELTDate from '../utils/parseGDELTDate.js'
import { fetchGDELTData } from '../services/gdeltApi.js'

export default async function fetchGDELT() {
  const params = new URLSearchParams({
    query: 'earthquake OR flood OR wildfire OR cyclone OR tsunami OR hurricane OR tornado',
    mode: 'ArtList',
    maxrecords: 50,
    format: 'json',
    sourcelang: 'english',
  })

  const { articles } = await fetchGDELTData(params, 'worker:gdelt')

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
