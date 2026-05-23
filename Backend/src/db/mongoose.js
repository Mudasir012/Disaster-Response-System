import mongoose from 'mongoose'
import { config } from '../config/index.js'

export async function connectDB() {
  try {
    await mongoose.connect(config.mongodbUri)
    console.log('[DB] MongoDB connected')
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err.message)
    process.exit(1)
  }

  mongoose.connection.on('error', (err) => {
    console.error('[DB] MongoDB runtime error:', err.message)
  })
}
