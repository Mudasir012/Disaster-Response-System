import mongoose from 'mongoose'

const locationSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  country: String,
  continent: String,
}, { _id: false })

const incidentSchema = new mongoose.Schema({
  event_type: {
    type: String,
    enum: ['earthquake', 'flood', 'wildfire', 'cyclone', 'tsunami', 'severe_weather'],
    required: true,
    index: true,
  },
  subtype: String,
  location: { type: locationSchema, required: true },
  severity: { type: Number, min: 1, max: 5, required: true },
  severity_label: {
    type: String,
    enum: ['MINOR', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
  },
  human_verified: { type: Boolean, default: false },
  summary: String,
  ai_confidence: Number,
  stats: {
    deaths: { type: Number, default: null },
    displaced: { type: Number, default: null },
    magnitude: { type: Number, default: null },
    depth_km: { type: Number, default: null },
    wind_speed: { type: Number, default: null },
  },
  sources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RawEvent' }],
  source_count: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'resolved', 'monitoring', 'deleted'],
    default: 'active',
    index: true,
  },
  first_seen: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } })

incidentSchema.index({ 'location.lat': 1, 'location.lng': 1 })
incidentSchema.index({ severity: -1, created_at: -1 })
incidentSchema.index({ event_type: 1, created_at: -1 })

incidentSchema.pre('save', function (next) {
  const labels = { 1: 'MINOR', 2: 'LOW', 3: 'MODERATE', 4: 'HIGH', 5: 'CRITICAL' }
  this.severity_label = labels[this.severity] || 'MINOR'
  this.last_updated = new Date()
  next()
})

export const Incident = mongoose.model('Incident', incidentSchema)
