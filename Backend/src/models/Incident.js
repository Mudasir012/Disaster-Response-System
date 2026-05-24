import mongoose from 'mongoose'

const incidentSchema = new mongoose.Schema({
  event_type: {
    type: String,
    enum: ['earthquake', 'flood', 'wildfire', 'cyclone', 'tsunami', 'severe_weather'],
    required: true,
  },
  subtype: String,
  location: {
    name: String,
    lat: Number,
    lng: Number,
    country: String,
    continent: String,
  },
  severity: { type: Number, min: 1, max: 5, required: true },
  severity_label: String,
  human_verified: { type: Boolean, default: false },
  summary: String,
  ai_confidence: Number,
  stats: {
    deaths: Number,
    displaced: Number,
    magnitude: Number,
    depth_km: Number,
    wind_speed: Number,
  },
  sources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RawEvent' }],
  source_count: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'resolved', 'monitoring', 'deleted'],
    default: 'active',
  },
  first_seen: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
})

incidentSchema.index({ 'location.lat': 1, 'location.lng': 1 })
incidentSchema.index({ severity: -1, created_at: -1 })
incidentSchema.index({ event_type: 1 })
incidentSchema.index({ status: 1, last_updated: -1 })

export const Incident = mongoose.model('Incident', incidentSchema)
