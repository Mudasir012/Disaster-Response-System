import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { AlertSubscription } from '../models/AlertSubscription.js'
import { Incident } from '../models/Incident.js'
import { Resend } from 'resend'

const router = Router()
const resend = new Resend(process.env.RESEND_API_KEY)

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

router.post('/subscribe', async (req, res, next) => {
  try {
    const { email, rules } = req.body
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' })
    }

    const token = uuidv4()
    const sub = await AlertSubscription.findOneAndUpdate(
      { email },
      { email, token, rules: rules || [{ region: 'worldwide', event_types: [], min_severity: 1 }] },
      { upsert: true, new: true }
    )

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const confirmUrl = `${frontendUrl}/alerts/confirm?token=${token}`

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS || 'Sentinel <alerts@sentinel.app>',
        to: email,
        subject: 'Confirm your alert subscription',
        html: `<p>Click <a href="${confirmUrl}">here</a> to confirm your alert subscription.</p>
               <p>Manage your subscription: <a href="${frontendUrl}/alerts/manage?token=${token}">${frontendUrl}/alerts/manage?token=${token}</a></p>`,
      })
    } catch {
      // email send failure is non-fatal
    }

    res.json({ message: 'Subscription created', token })
  } catch (err) {
    next(err)
  }
})

router.get('/:token', async (req, res, next) => {
  try {
    const sub = await AlertSubscription.findOne({ token: req.params.token }).lean()
    if (!sub) return res.status(404).json({ error: 'Subscription not found' })
    res.json(sub)
  } catch (err) {
    next(err)
  }
})

router.patch('/:token', async (req, res, next) => {
  try {
    const { rules } = req.body
    const sub = await AlertSubscription.findOneAndUpdate(
      { token: req.params.token },
      { rules },
      { new: true }
    )
    if (!sub) return res.status(404).json({ error: 'Subscription not found' })
    res.json({ message: 'Updated', sub })
  } catch (err) {
    next(err)
  }
})

router.post('/:token/confirm', async (req, res, next) => {
  try {
    const sub = await AlertSubscription.findOneAndUpdate(
      { token: req.params.token },
      { confirmed: true },
      { new: true }
    )
    if (!sub) return res.status(404).json({ error: 'Subscription not found' })
    res.json({ message: 'Subscription confirmed' })
  } catch (err) {
    next(err)
  }
})

router.post('/:token/test', async (req, res, next) => {
  try {
    const sub = await AlertSubscription.findOne({ token: req.params.token })
    if (!sub) return res.status(404).json({ error: 'Subscription not found' })

    const fakeIncident = {
      _id: 'test',
      event_type: 'earthquake',
      severity: 4,
      location: { name: 'Test Location', continent: 'Test' },
      summary: 'This is a test alert.',
      first_seen: new Date().toISOString(),
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    await resend.emails.send({
      from: process.env.EMAIL_FROM_ADDRESS || 'Sentinel <alerts@sentinel.app>',
      to: sub.email,
      subject: `[TEST] [SEV-4] EARTHQUAKE — Test Location`,
      html: `<p>This is a test alert from Sentinel.</p><p><a href="${frontendUrl}/alerts/manage?token=${sub.token}">Manage alerts</a></p>`,
    })

    res.json({ message: 'Test alert sent' })
  } catch (err) {
    next(err)
  }
})

router.delete('/:token', async (req, res, next) => {
  try {
    const sub = await AlertSubscription.findOneAndDelete({ token: req.params.token })
    if (!sub) return res.status(404).json({ error: 'Subscription not found' })
    res.json({ message: 'Subscription deleted' })
  } catch (err) {
    next(err)
  }
})

export default router
