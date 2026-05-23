import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { AlertSubscription } from '../models/AlertSubscription.js'
import { sendAlertEmail } from '../services/email.js'

const router = Router()

router.post('/subscribe', async (req, res, next) => {
  try {
    const { email, rules } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const token = uuidv4()
    const subscription = await AlertSubscription.findOneAndUpdate(
      { email },
      { email, token, rules: rules || [], confirmed: false },
      { upsert: true, new: true }
    )

    res.json({ message: 'Subscription created', token: subscription.token })
  } catch (err) {
    next(err)
  }
})

router.get('/:token', async (req, res, next) => {
  try {
    const sub = await AlertSubscription.findOne({ token: req.params.token })
    if (!sub) return res.status(404).json({ message: 'Subscription not found' })
    res.json({ email: sub.email, rules: sub.rules, confirmed: sub.confirmed })
  } catch (err) {
    next(err)
  }
})

router.patch('/:token', async (req, res, next) => {
  try {
    const { rules } = req.body
    const sub = await AlertSubscription.findOneAndUpdate(
      { token: req.params.token },
      { rules, confirmed: true },
      { new: true }
    )
    if (!sub) return res.status(404).json({ message: 'Subscription not found' })
    res.json({ message: 'Updated', rules: sub.rules })
  } catch (err) {
    next(err)
  }
})

router.post('/:token/test', async (req, res, next) => {
  try {
    const sub = await AlertSubscription.findOne({ token: req.params.token })
    if (!sub) return res.status(404).json({ message: 'Subscription not found' })

    await sendAlertEmail({
      to: sub.email,
      subject: '[TEST] DisasterTracker Alert',
      text: 'This is a test alert to verify your subscription is working.',
      html: '<h2>Test Alert</h2><p>This is a test alert to verify your subscription is working.</p>',
    })

    res.json({ message: 'Test alert sent' })
  } catch (err) {
    next(err)
  }
})

router.delete('/:token', async (req, res, next) => {
  try {
    const sub = await AlertSubscription.findOneAndDelete({ token: req.params.token })
    if (!sub) return res.status(404).json({ message: 'Subscription not found' })
    res.json({ message: 'Unsubscribed' })
  } catch (err) {
    next(err)
  }
})

export default router
