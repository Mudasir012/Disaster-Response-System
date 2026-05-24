import mongoose from 'mongoose'

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
})

export const AdminUser = mongoose.model('AdminUser', adminUserSchema)
