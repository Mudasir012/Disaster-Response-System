import 'dotenv/config'
import mongoose from 'mongoose'
import { Resource } from '../src/models/Resource.js'

const DEMO_RESOURCES = [
  { type: 'vehicle', name: 'Response Unit 1', status: 'available', lng: 78.46, lat: 17.38, details: { vehicle_type: 'truck', capacity: 8, notes: 'All-terrain response vehicle' } },
  { type: 'vehicle', name: 'Logistics Van A', status: 'busy', lng: 78.48, lat: 17.40, details: { vehicle_type: 'van', capacity: 4 } },
  { type: 'ambulance', name: 'Ambulance AL-01', status: 'available', lng: 78.44, lat: 17.36, details: { capacity: 2, specialization: 'emergency' } },
  { type: 'ambulance', name: 'Ambulance AL-02', status: 'busy', lng: 78.50, lat: 17.42, details: { capacity: 2, specialization: 'critical_care' } },
  { type: 'ambulance', name: 'Ambulance AL-03', status: 'available', lng: 78.42, lat: 17.34, details: { capacity: 2, specialization: 'transport' } },
  { type: 'personnel', name: 'Search & Rescue Team', status: 'available', lng: 78.47, lat: 17.39, details: { capacity: 12, specialization: 'urban_search', contact: 'SAR-COM' } },
  { type: 'personnel', name: 'Medical Unit Alpha', status: 'available', lng: 78.45, lat: 17.37, details: { capacity: 6, specialization: 'triage' } },
  { type: 'personnel', name: 'Engineer Squad', status: 'critical', lng: 78.43, lat: 17.41, details: { capacity: 4, specialization: 'structural', notes: 'Low on fuel' } },
  { type: 'shelter', name: 'Evacuation Center - North', status: 'available', lng: 78.49, lat: 17.44, details: { capacity: 500, current_load: 230, contact: 'NEC-01' } },
  { type: 'shelter', name: 'Community Hall Shelter', status: 'busy', lng: 78.41, lat: 17.33, details: { capacity: 200, current_load: 185, contact: 'CHS-02' } },
  { type: 'supply_point', name: 'Main Supply Depot', status: 'available', lng: 78.46, lat: 17.35, details: { capacity: 10000, notes: 'Food, water, medical supplies' } },
  { type: 'supply_point', name: 'Field Supply Cache - West', status: 'critical', lng: 78.40, lat: 17.38, details: { capacity: 2000, current_load: 150, notes: 'Running low, resupply needed' } },
  { type: 'supply_point', name: 'Water Distribution Point', status: 'available', lng: 78.44, lat: 17.43, details: { capacity: 5000, current_load: 3200 } },
  { type: 'medical_post', name: 'Field Hospital - Main', status: 'available', lng: 78.47, lat: 17.36, details: { capacity: 50, specialization: 'emergency', contact: 'FH-MAIN' } },
  { type: 'medical_post', name: 'Triage Station - East', status: 'busy', lng: 78.51, lat: 17.39, details: { capacity: 20, current_load: 18, notes: 'Over capacity' } },
  { type: 'medical_post', name: 'Mobile Clinic', status: 'available', lng: 78.43, lat: 17.40, details: { capacity: 15, specialization: 'general' } },
  { type: 'vehicle', name: 'Rescue Helicopter', status: 'available', lng: 78.45, lat: 17.32, details: { vehicle_type: 'helicopter', capacity: 6 } },
  { type: 'ambulance', name: 'Ambulance AL-04', status: 'critical', lng: 78.52, lat: 17.41, details: { capacity: 2, notes: 'Damaged, awaiting repair' } },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    await Resource.deleteMany({})
    console.log('Cleared existing resources')

    const docs = DEMO_RESOURCES.map((r) => ({
      type: r.type,
      name: r.name,
      status: r.status,
      location: { type: 'Point', coordinates: [r.lng, r.lat] },
      details: r.details || {},
    }))

    const created = await Resource.insertMany(docs)
    console.log(`Seeded ${created.length} demo resources`)

    await mongoose.disconnect()
    console.log('Done')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

seed()
