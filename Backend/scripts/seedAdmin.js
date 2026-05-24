import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { AdminUser } from '../src/models/AdminUser.js'

const email = process.argv[2] || process.env.ADMIN_EMAIL
const password = process.argv[3] || process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error('Usage: node scripts/seedAdmin.js <email> <password>')
  console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables')
  process.exit(1)
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const existing = await AdminUser.findOne({ email })
  if (existing) {
    console.log(`Admin user ${email} already exists`)
    await mongoose.disconnect()
    return
  }

  const password_hash = await bcrypt.hash(password, 12)

  await AdminUser.create({ email, password_hash })
  console.log(`Admin user ${email} created`)

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
