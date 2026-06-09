import { Router } from 'express'

const router = Router()
const TRACCAR_URL = process.env.TRACCAR_URL || 'http://localhost:8082'
const TRACCAR_USER = process.env.TRACCAR_USER || ''
const TRACCAR_PASS = process.env.TRACCAR_PASS || ''

async function traccarFetch(path) {
  const url = `${TRACCAR_URL}/api/${path}`
  if (!TRACCAR_USER || !TRACCAR_PASS) {
    return []
  }
  const auth = Buffer.from(`${TRACCAR_USER}:${TRACCAR_PASS}`).toString('base64')
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  })
  if (!res.ok) throw new Error(`Traccar API error: ${res.status}`)
  return res.json()
}

router.get('/devices', async (req, res, next) => {
  try {
    const devices = await traccarFetch('devices')
    res.json(devices)
  } catch (err) {
    next(err)
  }
})

router.get('/positions', async (req, res, next) => {
  try {
    const { deviceId } = req.query
    let path = 'positions'
    if (deviceId) path += `?deviceId=${deviceId}`
    const positions = await traccarFetch(path)
    res.json(positions)
  } catch (err) {
    next(err)
  }
})

router.get('/stops', async (req, res, next) => {
  try {
    const { deviceId, from, to } = req.query
    let path = 'reports/stops'
    const params = []
    if (deviceId) params.push(`deviceId=${deviceId}`)
    if (from) params.push(`from=${from}`)
    if (to) params.push(`to=${to}`)
    if (params.length) path += `?${params.join('&')}`
    const stops = await traccarFetch(path)
    res.json(stops)
  } catch (err) {
    next(err)
  }
})

export default router
