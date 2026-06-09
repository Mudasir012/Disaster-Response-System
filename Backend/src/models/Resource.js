import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['vehicle', 'ambulance', 'personnel', 'shelter', 'supply_point', 'medical_post'],
    required: true,
  },
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'busy', 'critical'],
    default: 'available',
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  details: {
    contact: String,
    capacity: Number,
    current_load: Number,
    vehicle_type: String,
    specialization: String,
    notes: String,
  },
  traccar_id: Number,
  last_updated: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
})

resourceSchema.index({ location: '2dsphere' })
resourceSchema.index({ type: 1, status: 1 })

export const Resource = mongoose.model('Resource', resourceSchema)
