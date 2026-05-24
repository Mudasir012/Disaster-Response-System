import mongoose from 'mongoose'

const rawEventSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['gdelt', 'usgs', 'gdacs', 'noaa'],
    required: true,
  },
  source_event_id: { type: String, required: true },
  raw_payload: mongoose.Schema.Types.Mixed,
  raw_text: String,
  incident_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', default: null },
  processed: { type: Boolean, default: false },
  processed_at: Date,
  fetched_at: { type: Date, default: Date.now },
})

rawEventSchema.index({ source_event_id: 1, source: 1 }, { unique: true })
rawEventSchema.index({ fetched_at: 1 }, { expireAfterSeconds: 2592000 })

export const RawEvent = mongoose.model('RawEvent', rawEventSchema)
