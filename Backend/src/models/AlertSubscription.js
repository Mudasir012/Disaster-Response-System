import mongoose from 'mongoose'

const alertSubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  rules: [{
    region: { type: String, default: 'worldwide' },
    event_types: [String],
    min_severity: { type: Number, default: 1 },
  }],
  confirmed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  last_alert: Date,
})

export const AlertSubscription = mongoose.model('AlertSubscription', alertSubscriptionSchema)
