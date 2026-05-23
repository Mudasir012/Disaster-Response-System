import mongoose from 'mongoose'

const aiProcessingLogSchema = new mongoose.Schema({
  incident_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  prompt_tokens: Number,
  completion_tokens: Number,
  duration_ms: Number,
  success: Boolean,
  error: String,
  result_summary: String,
}, { timestamps: { createdAt: 'created_at' } })

aiProcessingLogSchema.index({ created_at: 1 }, { expireAfterSeconds: 604800 })

export const AIProcessingLog = mongoose.model('AIProcessingLog', aiProcessingLogSchema)
