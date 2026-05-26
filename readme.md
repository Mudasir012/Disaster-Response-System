# DisasterTracker

> Real-time global disaster monitoring and alerting platform powered by AI.

DisasterTracker aggregates live disaster data from authoritative sources (USGS, GDACS, NOAA, GDELT), classifies events using Google Gemini AI, and displays them on an interactive real-time map. Get instant alerts when critical events occur near you.

## Features

- **Live Interactive Map** — MapLibre GL map with clustered GeoJSON points, color-coded by severity (1–5), region fly-to navigation, and hover popups.
- **AI-Powered Classification** — Each raw event is classified by Google Gemini 1.5 Flash: event type, location, severity score, plain-English summary, and confidence.
- **Multi-Source Data Ingestion** — Automatically fetches from USGS (earthquakes), GDACS (global disasters), NOAA (weather alerts), and GDELT (news monitoring).
- **Real-Time Updates** — New incidents, severity changes, and stats pushed instantly via WebSocket (Socket.IO).
- **Email Alert Subscriptions** — Subscribe with custom rules (region, type, minimum severity); high-severity alerts sent via Resend.
- **Analytics Dashboard** — Charts for incidents over time, severity distribution, top regions, and disaster type trends.
- **Admin Panel** — JWT-authenticated panel for managing incidents, triggering manual syncs, viewing AI logs, and monitoring queue health.

## Tech Stack

**Backend:** Node.js, Express, MongoDB + Mongoose, Redis + ioredis, BullMQ, Socket.IO, Google Gemini AI, Resend, Winston

**Frontend:** React 19, Vite, Tailwind CSS 4, MapLibre GL, Recharts, Zustand, Socket.IO Client, lucide-react

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB instance (Atlas or local)
- Redis instance
- [Google Gemini API key](https://aistudio.google.com)
- Resend API key (for email alerts)

### 1. Backend

```bash
cd Backend
cp .env.example .env
# Edit .env: set MONGODB_URI, REDIS_URL, GEMINI_API_KEY, RESEND_API_KEY, JWT_SECRET
npm install
npm run seed:admin
npm run dev
```

Server starts on `http://localhost:3001`.

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

App starts on `http://localhost:5173`. The Vite dev server proxies `/api` and `/socket.io` to the backend automatically.

### 3. Production Build

```bash
cd Frontend
npm run build     # Outputs to dist/
```

## Project Structure

```
Disaster-Response-System/
├── Backend/
│   ├── src/
│   │   ├── server.js            # Entry point
│   │   ├── app.js               # Express app setup
│   │   ├── socket.js            # WebSocket server
│   │   ├── config/              # DB, Redis, Gemini clients
│   │   ├── middleware/           # Auth, rate limiting, error handling
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # REST API routes
│   │   ├── pipeline/            # Data processing pipeline
│   │   ├── queues/              # BullMQ queue definitions
│   │   ├── workers/             # Data source fetchers
│   │   ├── processors/          # Sync & alert processors
│   │   ├── scheduler/           # Cron jobs
│   │   └── utils/               # Logger, helpers
│   └── scripts/
│       └── seedAdmin.js         # Create admin user
└── Frontend/
    └── src/
        ├── pages/               # Route pages
        ├── components/          # UI components
        ├── store/               # Zustand stores
        ├── lib/                 # API & socket clients
        └── utils/               # Helpers
```

## Data Sources

| Source | Data | Frequency |
|---|---|---|
| **USGS** | Earthquakes (mag 2.5+) | Every 15 min |
| **GDACS** | Global disasters (RSS) | Every 15 min |
| **NOAA** | Weather alerts (US) | Every 15 min |
| **GDELT** | News article monitoring | Every 15 min |

## Environment Variables

See `Backend/.env.example` for all configuration options. Key variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `GEMINI_API_KEY` | Google Gemini AI API key |
| `RESEND_API_KEY` | Resend email API key |
| `JWT_SECRET` | 64-char hex string for admin auth |
| `SYNC_INTERVAL_MINUTES` | Data sync interval (default: 15) |

## API Overview

| Endpoint | Description |
|---|---|
| `GET /api/health` | Health check |
| `GET /api/incidents` | List incidents (with filters) |
| `GET /api/incidents/geojson` | GeoJSON for map |
| `GET /api/analytics/summary` | Stats summary |
| `POST /api/alerts/subscribe` | Subscribe to alerts |
| `POST /api/admin/login` | Admin JWT login |
| `POST /api/admin/sync/:source` | Trigger manual sync |

## License

MIT
