# Sentinel

> Real-time global disaster monitoring and alerting platform powered by AI.

Sentinel aggregates live disaster data from authoritative sources (USGS, GDACS, NOAA, GDELT), classifies events using Groq AI, and displays them on an interactive real-time map. Get instant alerts when critical events occur near you.

## Features

- **Live Interactive Map** — Leaflet map with clustered GeoJSON points, color-coded by severity (1–5), region fly-to navigation, and incident cards.
- **AI-Powered Classification** — Each raw event is classified by Groq LLM: event type, location, severity score, plain-English summary, and confidence.
- **Multi-Source Data Ingestion** — Automatically fetches from USGS (earthquakes), GDACS (global disasters), NOAA (weather alerts), and GDELT (news monitoring).
- **Real-Time Updates** — New incidents, severity changes, and stats pushed instantly via WebSocket (Socket.IO).
- **Email Alert Subscriptions** — Subscribe with custom rules (region, type, minimum severity); high-severity alerts sent via Resend.
- **Analytics Dashboard** — Charts for incidents over time, severity distribution, top regions, and disaster type trends.
- **Admin Panel** — JWT-authenticated panel for managing incidents, triggering manual syncs, viewing AI logs, and monitoring queue health.

## Tech Stack

**Backend:** Node.js, Express, MongoDB + Mongoose, Redis + ioredis, BullMQ, Socket.IO, Groq AI, Resend, Winston

**Frontend:** React 19, Vite, Tailwind CSS 4, Leaflet / MapLibre GL, Recharts, Socket.IO Client, lucide-react

## Quick Start (Local)

### Prerequisites

- Node.js 20+
- MongoDB instance (Atlas or local)
- Redis instance
- Groq API key
- Resend API key (for email alerts)

### 1. Backend

```bash
cd Backend
cp .env.example .env
# Edit .env: set MONGODB_URI, REDIS_URL, GROQ_API_KEY, RESEND_API_KEY, JWT_SECRET
npm install
npm run seed:admin
npm run dev
```

Server starts on `http://localhost:3001`.

### 2. Frontend

```bash
cd Frontend
cp .env .env.local
# Edit .env.local if your backend is not on localhost:3001
npm install
npm run dev
```

App starts on `http://localhost:5173`.

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
│   │   ├── config/              # DB, Redis, Groq clients
│   │   ├── middleware/          # Auth, rate limiting, error handling
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
        ├── Dashboard/           # Dashboard pages
        ├── Landing/             # Marketing site
        ├── Auth/                # Auth pages
        ├── ResourceTracking/    # Resource tracking
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
| `REDIS_URL` | Redis connection string (use `rediss://` for TLS) |
| `GROQ_API_KEY` | Groq AI API key |
| `RESEND_API_KEY` | Resend email API key |
| `EMAIL_FROM_ADDRESS` | Verified sender address for alert emails |
| `JWT_SECRET` | 64-char hex string for admin auth |
| `FRONTEND_URL` | Production frontend URL (used for CORS and email links) |
| `NOMINATIM_EMAIL` | Email for Nominatim usage policy |

## Production Deployment

### Architecture

- **Frontend:** Deploy static build to Vercel.
- **Backend:** Deploy to a persistent Node.js host (Render, Railway, Fly.io, Hetzner, etc.). Do **not** use Vercel serverless functions — Socket.IO, BullMQ workers, and cron require a long-running process.
- **Database:** MongoDB Atlas.
- **Queue / cache:** Upstash Redis or Redis Cloud with TLS.

### Frontend (Vercel)

1. Create a Vercel project from your GitHub repo.
2. Set **Root Directory** to `Frontend`.
3. Set **Framework Preset** to Vite.
4. Add environment variables:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   VITE_SOCKET_URL=https://api.yourdomain.com
   ```
5. `Frontend/vercel.json` already handles SPA routing.

### Backend

1. Create a Web Service on Render/Railway/Fly pointing to `/Backend`.
2. Set **Build Command:** `npm install`
3. Set **Start Command:** `npm start`
4. Add all backend environment variables from `.env.example`.
5. Run `npm run seed:admin` once after first deploy.
6. Verify health at `GET /api/health`.

### CI/CD

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`:

- Lints and builds frontend on every PR/push.
- Lints backend on every PR/push.
- Deploys frontend to Vercel on pushes to `main`.

Required repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## API Overview

| Endpoint | Description |
|---|---|
| `GET /api/health` | Health check |
| `GET /api/incidents` | List incidents (with filters) |
| `GET /api/incidents/:id` | Incident detail |
| `GET /api/analytics/summary` | Analytics summary |
| `POST /api/alerts/subscribe` | Subscribe to alerts |
| `POST /api/chat` | AI assistant chat |
| `POST /api/admin/login` | Admin login |

## License

MIT
