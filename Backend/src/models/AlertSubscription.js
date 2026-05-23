import mongoose from 'mongoose'

const ruleSchema = new mongoose.Schema({
  region: { type: String, default: 'worldwide' },
  event_types: [String],
  min_severity: { type: Number, default: 3 },
}, { _id: false })

const alertSubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  rules: [ruleSchema],
  confirmed: { type: Boolean, default: false },
  last_alert: Date,
}, { timestamps: { createdAt: 'created_at' } })

export const AlertSubscription = mongoose.model('AlertSubscription', alertSubscriptionSchema)
