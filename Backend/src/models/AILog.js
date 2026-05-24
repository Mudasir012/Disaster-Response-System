import mongoose from 'mongoose'

const aiLogSchema = new mongoose.Schema({
  incident_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  prompt_tokens: Number,
  completion_tokens: Number,
  duration_ms: Number,
  success: Boolean,
  error: String,
  result_summary: String,
  created_at: { type: Date, default: Date.now },
})

aiLogSchema.index({ created_at: 1 }, { expireAfterSeconds: 604800 })

export const AILog = mongoose.model('AILog', aiLogSchema)
