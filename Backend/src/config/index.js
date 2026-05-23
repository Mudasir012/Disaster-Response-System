import 'dotenv/config'

function required(key) {
  if (process.env.NODE_ENV === 'production' && !process.env[key]) {
    throw new Error(`Required env var ${key} is not set`)
  }
  return process.env[key] || ''
}

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-tracker',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  jwtSecret: required('JWT_SECRET'),

  anthropicApiKey: required('ANTHROPIC_API_KEY'),
  anthropicUrl: process.env.ANTHROPIC_URL || 'https://api.anthropic.com/v1/messages',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',

  twitterBearerToken: process.env.TWITTER_BEARER_TOKEN || '',
  twitterApiUrl: process.env.TWITTER_API_URL || 'https://api.twitter.com/2/tweets/search/recent',
  twitterQuery: process.env.TWITTER_QUERY || 'earthquake OR flood OR wildfire OR cyclone OR tsunami -has:links',

  newsApiKey: process.env.NEWS_API_KEY || '',
  newsApiUrl: process.env.NEWS_API_URL || 'https://newsapi.org/v2/everything',
  newsApiQuery: process.env.NEWS_API_QUERY || 'earthquake OR flood OR wildfire OR cyclone OR tsunami OR hurricane OR tornado OR volcanic eruption',

  noaaApiUrl: process.env.NOAA_API_URL || 'https://api.weather.gov/alerts/active',
  usgsApiUrl: process.env.USGS_API_URL || 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
  gdacsApiUrl: process.env.GDACS_API_URL || 'https://gdacs.org/xml/rss.xml',
  nominatimUrl: process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search',
  nominatimEmail: process.env.NOMINATIM_EMAIL || 'dev@example.com',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendApiUrl: process.env.RESEND_API_URL || 'https://api.resend.com/emails',
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS || 'DisasterTracker <alerts@disastertracker.app>',

  syncIntervalMs: parseInt(process.env.SYNC_INTERVAL_MS || '120000'),
  aiConfidenceThreshold: parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || '0.7'),
  maxIncidentsGeoJSON: parseInt(process.env.MAX_INCIDENTS_GEOJSON || '500'),
  userAgent: process.env.USER_AGENT || 'DisasterTracker/1.0',

  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@disastertracker.app',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || 'admin123',
}
