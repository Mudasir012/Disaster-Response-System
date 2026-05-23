import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './db/mongoose.js'
import { Incident } from './models/Incident.js'
import { User } from './models/User.js'
import { config } from './config/index.js'

const seedIncidents = [
  {
    event_type: 'earthquake',
    subtype: 'M7.8 Shallow Crustal Earthquake',
    location: { name: 'Kahramanmaras, Turkey', lat: 37.5766, lng: 36.9229, country: 'Turkey', continent: 'Asia' },
    severity: 5,
    human_verified: false,
    summary: 'A catastrophic magnitude 7.8 earthquake struck near Kahramanmaras in southern Turkey, causing widespread devastation across multiple provinces. Thousands of buildings have collapsed.',
    ai_confidence: 0.94,
    stats: { deaths: 59000, displaced: 1400000, magnitude: 7.8, depth_km: 17.9 },
    source_count: 12,
    status: 'active',
    first_seen: new Date(Date.now() - 86400000 * 120),
    last_updated: new Date(),
  },
  {
    event_type: 'flood',
    subtype: 'Catastrophic River Flooding',
    location: { name: 'Sindh Province, Pakistan', lat: 26.0, lng: 68.5, country: 'Pakistan', continent: 'Asia' },
    severity: 4,
    human_verified: false,
    summary: 'Monsoon rains caused catastrophic flooding across Pakistan Sindh province, affecting millions. Entire villages submerged, hundreds of thousands displaced.',
    ai_confidence: 0.91,
    stats: { deaths: 1700, displaced: 8000000, magnitude: null },
    source_count: 8,
    status: 'active',
    first_seen: new Date(Date.now() - 86400000 * 90),
    last_updated: new Date(),
  },
  {
    event_type: 'wildfire',
    subtype: 'Extreme Wildfire Complex',
    location: { name: 'British Columbia, Canada', lat: 53.7267, lng: -127.6476, country: 'Canada', continent: 'Americas' },
    severity: 4,
    human_verified: false,
    summary: 'Massive wildfire complexes burning across British Columbia, fueled by drought and high winds. Thousands of hectares consumed, evacuation orders in place.',
    ai_confidence: 0.88,
    stats: { deaths: 4, displaced: 50000, magnitude: null },
    source_count: 6,
    status: 'active',
    first_seen: new Date(Date.now() - 86400000 * 45),
    last_updated: new Date(),
  },
  {
    event_type: 'cyclone',
    subtype: 'Category 5 Super Cyclone',
    location: { name: 'Bay of Bengal, Bangladesh', lat: 22.3, lng: 91.8, country: 'Bangladesh', continent: 'Asia' },
    severity: 5,
    human_verified: false,
    summary: 'Super cyclone with sustained winds of 260 km/h approaching Bangladesh coast. Mass evacuations underway as storm surges threaten coastal districts.',
    ai_confidence: 0.92,
    stats: { deaths: 45, displaced: 2000000, magnitude: null, wind_speed: 260 },
    source_count: 10,
    status: 'active',
    first_seen: new Date(Date.now() - 86400000 * 7),
    last_updated: new Date(),
  },
  {
    event_type: 'tsunami',
    subtype: 'Tsunami Following M8.2 Offshore Earthquake',
    location: { name: 'Honshu Coast, Japan', lat: 37.5, lng: 143.5, country: 'Japan', continent: 'Asia' },
    severity: 3,
    human_verified: false,
    summary: 'A magnitude 8.2 earthquake off Honshu has generated a tsunami with waves up to 3 metres. Coastal communities evacuated, warnings in effect.',
    ai_confidence: 0.85,
    stats: { deaths: 12, displaced: 150000, magnitude: 8.2, depth_km: 25.0 },
    source_count: 7,
    status: 'active',
    first_seen: new Date(Date.now() - 86400000 * 3),
    last_updated: new Date(),
  },
  {
    event_type: 'severe_weather',
    subtype: 'Tornado Outbreak',
    location: { name: 'Midwest, United States', lat: 38.5, lng: -90.0, country: 'United States', continent: 'Americas' },
    severity: 4,
    human_verified: false,
    summary: 'Major tornado outbreak across the US Midwest, multiple EF-4 and EF-5 tornadoes. Widespread destruction across several states.',
    ai_confidence: 0.9,
    stats: { deaths: 89, displaced: 300000, magnitude: null },
    source_count: 9,
    status: 'active',
    first_seen: new Date(Date.now() - 86400000 * 2),
    last_updated: new Date(),
  },
  {
    event_type: 'earthquake',
    subtype: 'M6.4 Aftershock Sequence',
    location: { name: 'Hatay Province, Turkey', lat: 36.2, lng: 36.1, country: 'Turkey', continent: 'Asia' },
    severity: 3,
    human_verified: true,
    summary: 'A magnitude 6.4 aftershock struck Hatay province, causing further damage to already weakened structures. Several buildings collapsed.',
    ai_confidence: 0.87,
    stats: { deaths: 6, displaced: 20000, magnitude: 6.4, depth_km: 10.0 },
    source_count: 5,
    status: 'active',
    first_seen: new Date(Date.now() - 86400000 * 30),
    last_updated: new Date(),
  },
]

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB...')
    await connectDB()

    console.log('[Seed] Clearing existing data...')
    await Incident.deleteMany({})
    await User.deleteMany({})

    console.log('[Seed] Inserting incidents...')
    await Incident.insertMany(seedIncidents)
    console.log(`[Seed] Inserted ${seedIncidents.length} incidents`)

    console.log('[Seed] Creating admin user...')
    await User.create({
      email: config.seedAdminEmail,
      password: config.seedAdminPassword,
      name: 'Admin',
    })
    console.log(`[Seed] Admin user created (email: ${config.seedAdminEmail})`)

    console.log('[Seed] Done!')
    process.exit(0)
  } catch (err) {
    console.error('[Seed] Error:', err)
    process.exit(1)
  }
}

seed()
