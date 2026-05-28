const now = Date.now()

const incidents = [
  { id: 'INC-2026-0042', type: 'Earthquake', severity: 'critical', magnitude: 7.8, lat: 35.7, lng: 140.1, location: 'Chiba Prefecture, Japan', region: 'Asia Pacific', timestamp: now - 7200000, status: 'active', summary: 'Major earthquake 7.8 magnitude struck off the coast of Chiba Prefecture at a depth of 25km. Widespread shaking across the Kanto region. Tsunami advisory issued for coastal areas.', casualties: 12, affected: 84000, source: 'USGS' },
  { id: 'INC-2026-0041', type: 'Hurricane', severity: 'critical', magnitude: 4, lat: 25.8, lng: -78.2, location: 'Western Atlantic, 150km NE of Nassau', region: 'North Atlantic', timestamp: now - 3600000, status: 'monitoring', summary: 'Category 4 hurricane with sustained winds of 220km/h moving NW at 15km/h. Projected to approach the Florida coast within 48 hours. Evacuation orders issued for coastal counties.', casualties: 0, affected: 320000, source: 'NOAA' },
  { id: 'INC-2026-0040', type: 'Wildfire', severity: 'severe', magnitude: 0, lat: 34.1, lng: -118.6, location: 'Santa Monica Mountains, California', region: 'North America', timestamp: now - 5400000, status: 'active', summary: 'Large wildfire spanning 12,000 acres driven by Santa Ana winds. Mandatory evacuations in Malibu and Topanga Canyon. Air quality alerts across the Los Angeles basin.', casualties: 2, affected: 56000, source: 'GDACS' },
  { id: 'INC-2026-0039', type: 'Tsunami', severity: 'tsunami', magnitude: 0, lat: -8.5, lng: 115.2, location: 'Bali Coast, Indonesia', region: 'Asia Pacific', timestamp: now - 10800000, status: 'active', summary: 'Tsunami waves of up to 3m detected following a 6.9 magnitude offshore earthquake. Coastal communities from Denpasar to Gilimanuk on alert. Wave train expected to continue for several hours.', casualties: 5, affected: 120000, source: 'GDACS' },
  { id: 'INC-2026-0038', type: 'Flood', severity: 'moderate', magnitude: 0, lat: 27.7, lng: 85.3, location: 'Kathmandu Valley, Nepal', region: 'South Asia', timestamp: now - 14400000, status: 'monitoring', summary: 'Monsoon flooding affecting low-lying areas of the Kathmandu Valley. Rising water levels in the Bagmati and Bishnumati rivers. Road access disrupted in several districts.', casualties: 8, affected: 45000, source: 'USGS' },
  { id: 'INC-2026-0037', type: 'Earthquake', severity: 'severe', magnitude: 6.4, lat: 38.2, lng: 23.1, location: 'Thebes, Central Greece', region: 'Europe', timestamp: now - 21600000, status: 'active', summary: 'Moderate-to-strong earthquake 6.4 magnitude near Thebes, felt across Athens and central Greece. Damage reported to older buildings. Aftershocks expected in the coming days.', casualties: 3, affected: 28000, source: 'USGS' },
  { id: 'INC-2026-0036', type: 'Volcanic Eruption', severity: 'severe', magnitude: 0, lat: 19.4, lng: -99.1, location: 'Popocatepetl, Mexico', region: 'Central America', timestamp: now - 28800000, status: 'active', summary: 'Increased volcanic activity at Popocatepetl with ash plume reaching 6km above crater. Ashfall advisories for Puebla and surrounding municipalities. Airport operations affected in Mexico City.', casualties: 0, affected: 150000, source: 'GDACS' },
  { id: 'INC-2026-0035', type: 'Tornado', severity: 'severe', magnitude: 3, lat: 35.4, lng: -97.6, location: 'Oklahoma City, Oklahoma', region: 'North America', timestamp: now - 36000000, status: 'resolved', summary: 'EF-3 tornado touched down southwest of Oklahoma City with a 35km track. Significant structural damage in Moore and Norman. Power infrastructure affected across three counties.', casualties: 6, affected: 42000, source: 'NOAA' },
  { id: 'INC-2026-0034', type: 'Flood', severity: 'moderate', magnitude: 0, lat: 23.8, lng: 90.4, location: 'Dhaka Division, Bangladesh', region: 'South Asia', timestamp: now - 43200000, status: 'monitoring', summary: 'Widespread monsoon flooding across central Bangladesh. Major rivers exceeding danger levels. Thousands of hectares of cropland submerged.', casualties: 15, affected: 780000, source: 'GDACS' },
  { id: 'INC-2026-0033', type: 'Earthquake', severity: 'info', magnitude: 4.2, lat: 39.6, lng: 116.4, location: 'Beijing, China', region: 'Asia Pacific', timestamp: now - 50400000, status: 'resolved', summary: 'Light earthquake 4.2 magnitude felt in Beijing municipality. No structural damage reported. Minor shaking alerted emergency services who conducted rapid assessments.', casualties: 0, affected: 5000, source: 'USGS' },
  { id: 'INC-2026-0032', type: 'Landslide', severity: 'moderate', magnitude: 0, lat: -13.2, lng: -72.3, location: 'Cusco Region, Peru', region: 'South America', timestamp: now - 57600000, status: 'monitoring', summary: 'Large landslide triggered by heavy rainfall blocking the Sacred Valley highway. Affected communities isolated. Emergency supplies being airlifted.', casualties: 4, affected: 12000, source: 'ReliefWeb' },
  { id: 'INC-2026-0031', type: 'Wildfire', severity: 'moderate', magnitude: 0, lat: 37.8, lng: -122.2, location: 'Oakland Hills, California', region: 'North America', timestamp: now - 64800000, status: 'resolved', summary: 'Brush fire in the Oakland Hills contained at 400 acres. Structures threatened but no losses. Air quality advisory lifted. Cause under investigation.', casualties: 0, affected: 8000, source: 'GDACS' },
  { id: 'INC-2026-0030', type: 'Hurricane', severity: 'tsunami', magnitude: 3, lat: 14.6, lng: -61.0, location: 'Martinique, Lesser Antilles', region: 'Caribbean', timestamp: now - 72000000, status: 'resolved', summary: 'Category 3 hurricane passed south of Martinique. Significant storm surge along the southern coast. Widespread power outages affecting 60% of the island.', casualties: 2, affected: 95000, source: 'NOAA' },
  { id: 'INC-2026-0029', type: 'Earthquake', severity: 'info', magnitude: 4.8, lat: 33.8, lng: -118.1, location: 'Long Beach, California', region: 'North America', timestamp: now - 86400000, status: 'resolved', summary: 'Minor earthquake 4.8 magnitude in the Los Angeles Basin. Light shaking felt across Orange and Los Angeles counties. No tsunami risk. Infrastructure inspections underway.', casualties: 0, affected: 15000, source: 'USGS' },
  { id: 'INC-2026-0028', type: 'Flood', severity: 'critical', magnitude: 0, lat: 25.0, lng: 67.0, location: 'Karachi, Sindh, Pakistan', region: 'South Asia', timestamp: now - 93600000, status: 'active', summary: 'Catastrophic urban flooding in Karachi from record monsoon rainfall. 300mm in 24 hours. Drainage systems overwhelmed. Major roads and infrastructure submerged. Relief operations ongoing.', casualties: 45, affected: 1200000, source: 'GDACS' },
]

export default incidents

export const analyticsData = {
  severityDistribution: [
    { name: 'Critical', value: 3, color: '#e94560' },
    { name: 'Severe', value: 4, color: '#e94560' },
    { name: 'Tsunami', value: 2, color: '#0d9488' },
    { name: 'Moderate', value: 4, color: '#d97706' },
    { name: 'Info', value: 2, color: '#0f7ddb' },
  ],
  typeDistribution: [
    { name: 'Earthquake', count: 4 },
    { name: 'Flood', count: 3 },
    { name: 'Wildfire', count: 2 },
    { name: 'Hurricane', count: 2 },
    { name: 'Tsunami', count: 1 },
    { name: 'Volcanic', count: 1 },
    { name: 'Tornado', count: 1 },
    { name: 'Landslide', count: 1 },
  ],
  timeline: [
    { date: 'May 21', incidents: 8 },
    { date: 'May 22', incidents: 12 },
    { date: 'May 23', incidents: 5 },
    { date: 'May 24', incidents: 9 },
    { date: 'May 25', incidents: 15 },
    { date: 'May 26', incidents: 11 },
    { date: 'May 27', incidents: 7 },
    { date: 'May 28', incidents: 10 },
  ],
}
