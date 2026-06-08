import logger from '../utils/logger.js'

const MIN_INTERVAL_MS = 6000
const CACHE_TTL = 30_000

let lastCall = 0
let queue = []
let processing = false

const cache = new Map()

function getCached(key) {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data
  cache.delete(key)
  return null
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() })
  if (cache.size > 100) {
    const oldest = cache.keys().next().value
    cache.delete(oldest)
  }
}

async function processQueue() {
  if (processing) return
  processing = true

  while (queue.length > 0) {
    const now = Date.now()
    const wait = Math.max(0, MIN_INTERVAL_MS - (now - lastCall))
    if (wait > 0) {
      await new Promise((r) => setTimeout(r, wait))
    }

    const item = queue.shift()
    lastCall = Date.now()

    try {
      const response = await fetch(item.url, { signal: AbortSignal.timeout(20000) })
      const text = await response.text()

      if (response.status === 429) {
        item.reject(new Error('GDELT rate limited'))
        continue
      }

      if (!response.ok) {
        item.reject(new Error(`GDELT HTTP ${response.status}: ${text.slice(0, 100)}`))
        continue
      }

      let data
      try {
        data = JSON.parse(text)
      } catch {
        item.reject(new Error(`GDELT returned non-JSON: ${text.slice(0, 100)}`))
        continue
      }

      item.resolve(data)
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'UND_ERR_ABORTED') {
        item.reject(new Error('GDELT request timed out'))
      } else {
        item.reject(err)
      }
    }
  }

  processing = false
}

function enqueue(url) {
  return new Promise((resolve, reject) => {
    queue.push({ url, resolve, reject })
    processQueue()
  })
}

export async function fetchGDELTData(params, cacheKey) {
  if (cacheKey) {
    const cached = getCached(cacheKey)
    if (cached) return cached
  }

  const url = `https://api.gdeltproject.org/api/v2/doc/doc?${params}`
  logger.info(`[GDELT] Fetching: ${url.replace(/(?<=query=)[^&]+/, '[...]')}`)

  try {
    const data = await enqueue(url)
    const articles = (data.articles || []).map((a) => ({
      title: a.title || '',
      url: a.url || '',
      domain: a.domain || '',
      sourcecountry: a.sourcecountry || '',
      timestamp: a.seendate || '',
      image: a.image || null,
      seendate: a.seendate || '',
    }))

    const result = { articles, total: articles.length }
    if (cacheKey) setCache(cacheKey, result)
    return result
  } catch (err) {
    logger.warn(`[GDELT] Request failed: ${err.message}`)
    return { articles: [], total: 0, error: err.message }
  }
}
