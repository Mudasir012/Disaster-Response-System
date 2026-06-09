import mongoose from 'mongoose'
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AdminUser } from '../models/AdminUser.js'
import { Incident } from '../models/Incident.js'
import { RawEvent } from '../models/RawEvent.js'
import { AILog } from '../models/AILog.js'
import auth from '../middleware/auth.js'
import syncQueue from '../queues/syncQueue.js'
import processWithAI from '../pipeline/aiProcessor.js'
import geocode from '../pipeline/geocoder.js'
import severityLabel from '../utils/severityLabel.js'
import { emitSeverityEscalated } from '../socket.js'
import logger from '../utils/logger.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const admin = await AdminUser.findOne({ email })
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, admin.password_hash)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ email: admin.email, id: admin._id }, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ token })
  } catch (err) {
    next(err)
  }
})

router.get('/health', auth, async (req, res, next) => {
  try {
    const mongooseStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    const lastIncident = await Incident.findOne().sort({ created_at: -1 }).select('created_at').lean()

    res.json({
      mongodb: mongooseStatus,
      redis: 'connected',
      last_incident_at: lastIncident?.created_at || null,
    })
  } catch (err) {
    next(err)
  }
})

router.get('/queues', auth, async (req, res, next) => {
  try {
    const stats = await syncQueue.getJobCounts()
    res.json(stats)
  } catch (err) {
    next(err)
  }
})

router.post('/sync/:source', auth, async (req, res, next) => {
  try {
    const { source } = req.params
    const validSources = ['gdelt', 'usgs', 'gdacs', 'noaa']
    if (!validSources.includes(source)) {
      return res.status(400).json({ error: `Invalid source. Valid: ${validSources.join(', ')}` })
    }

    const job = await syncQueue.add('sync', { source }, {
      jobId: `${source}-${Date.now()}`,
    })
    res.json({ job_id: job.id })
  } catch (err) {
    next(err)
  }
})

router.get('/ai-log', auth, async (req, res, next) => {
  try {
    const { limit = 50 } = req.query
    const filter = {}
    if (req.query.success !== undefined) filter.success = req.query.success === 'true'

    const logs = await AILog.find(filter)
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .lean()

    res.json(logs)
  } catch (err) {
    next(err)
  }
})

router.patch('/incidents/:id', auth, async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
    if (!incident) return res.status(404).json({ error: 'Incident not found' })

    const oldSeverity = incident.severity
    const update = {}
    if (req.body.severity !== undefined) update.severity = req.body.severity
    if (req.body.severity !== undefined) update.severity_label = severityLabel(req.body.severity)
    if (req.body.status) update.status = req.body.status
    if (req.body.stats) update.stats = { ...incident.stats, ...req.body.stats }
    update.human_verified = true
    update.last_updated = new Date()

    const updated = await Incident.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })

    if (req.body.severity !== undefined && req.body.severity !== oldSeverity) {
      emitSeverityEscalated({
        incident_id: updated._id,
        old_severity: oldSeverity,
        new_severity: req.body.severity,
        incident: updated.toObject(),
      })
    }

    res.json(updated)
  } catch (err) {
    next(err)
  }
})

router.delete('/incidents/:id', auth, async (req, res, next) => {
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'deleted', last_updated: new Date() } },
      { new: true }
    )
    if (!incident) return res.status(404).json({ error: 'Incident not found' })
    res.json({ message: 'Incident deleted' })
  } catch (err) {
    next(err)
  }
})

router.post('/incidents/:id/reprocess', auth, async (req, res, next) => {
  try {
    const rawEvent = await RawEvent.findOne({ incident_id: req.params.id }).sort({ fetched_at: 1 })
    if (!rawEvent) return res.status(404).json({ error: 'No raw event found for this incident' })

    const normalised = {
      source: rawEvent.source,
      raw_text: rawEvent.raw_text,
      raw_payload: rawEvent.raw_payload,
    }

    const aiResult = await processWithAI(normalised)
    const geoResult = await geocode(aiResult.location_name, null, null)

    const update = {
      event_type: aiResult.event_type === 'unknown' ? 'tornado' : aiResult.event_type,
      'location.name': aiResult.location_name || 'Unknown',
      'location.lat': geoResult.lat,
      'location.lng': geoResult.lng,
      severity: aiResult.severity,
      severity_label: severityLabel(aiResult.severity),
      summary: aiResult.summary,
      ai_confidence: aiResult.ai_confidence,
      human_verified: true,
      last_updated: new Date(),
    }

    const updated = await Incident.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

export default router
