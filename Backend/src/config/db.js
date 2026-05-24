import mongoose from 'mongoose'
import logger from '../utils/logger.js'

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    logger.info('MongoDB connected')
  } catch (err) {
    logger.error('MongoDB connection error:', err)
    process.exit(1)
  }
}
