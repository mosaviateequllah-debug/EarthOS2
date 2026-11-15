# EarthOS — Planetary Intelligence Workspace

EarthOS is an evolving platform concept for climate resilience, food security and environmental monitoring. This repository is an upgraded, runnable prototype (v1.2), not yet a production global monitoring service.

## What works in this package
- Premium responsive planetary command-centre UI with Persian/English interface, accessible focus states and mobile off-canvas navigation.
- Progressive Web App shell with offline caching for core static pages (API responses are never cached).
- Updated visual system: layered planetary gradients, refined glass panels, responsive spacing and reduced-motion support.
- Interactive Leaflet map with selectable coordinates.
- Live backend integration with NASA POWER daily point data for temperature, precipitation and relative humidity.
- 7–365 day query window, latest valid values, precipitation time-series chart, source attribution, units and date range.
- FastAPI health endpoint, API catalog and OpenAPI docs.
- CORS allowlist configurable through `EARTHOS_CORS_ORIGINS`.
- Local Docker Compose setup with Nginx reverse proxy.
- Field reports still use browser local storage in this prototype.

## Important scientific and product boundaries
Dashboard KPI tiles outside the live NASA POWER panel are illustrative design placeholders. NASA POWER values are gridded/reanalysis-derived estimates, not local sensor readings and not forecasts. A precipitation time series is not an SPI drought index. No production AI model, authenticated account system, cloud database, carbon-credit marketplace, insurance payout engine or global alert network is included. See `docs/ARCHITECTURE_V1_1.md` for the capability boundary and roadmap.

## Run locally (Windows)
1. Install Python 3.10+.
2. Open a terminal in this folder and run:
   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn backend.main:app --reload
   ```
3. Serve `frontend/` using VS Code Live Server (typically `http://127.0.0.1:5500`).
4. Open the site and go to **داده‌های فضایی / Satellite Data**. Select a point and fetch NASA POWER data.
5. API docs: `http://127.0.0.1:8000/docs`.

## Run with Docker
Requires Docker Desktop with Compose:
```bash
docker compose up --build
```
Open `http://localhost:8080`. Stop with `docker compose down`.

## Configure
Copy `.env.example` to `.env` and set `EARTHOS_CORS_ORIGINS` to the exact trusted frontend origins. Do not use wildcard origins for deployment.

## Project layout
```text
EarthOS/
├── backend/          # FastAPI routes, NASA connector and domain modules
├── frontend/         # UI, styles and browser integration
├── data/             # raw, processed and geospatial data locations
├── models/           # future model artifacts, separated by task
├── scripts/          # data utilities and exploratory analysis
├── docs/             # project bible, data dictionary and architecture
├── deploy/           # reverse-proxy configuration
├── tests/            # API contract checks
├── Dockerfile
└── docker-compose.yml
```

## Test
```bash
python -m unittest discover -s tests -v
```

## Before public production launch
Add PostGIS persistence, user authentication and authorization, secure upload handling, rate limiting, observability, automated backups, CI/CD, accessibility testing, privacy policy, data licensing review, security assessment and scientific validation for each published indicator.


## v1.2 upgrade notes
- Preserved the existing EarthOS information architecture and NASA POWER integration while adding a progressive visual layer rather than replacing the original interface.
- Added mobile navigation, live localized date, PWA manifest and a conservative offline shell.
- Added baseline reverse-proxy security headers and centralized application version metadata.
- The service worker deliberately bypasses `/api/` and `/health`; live environmental data is never represented as offline-fresh.

## Production readiness checklist
This package is a stronger deployable prototype, not a certified global operational service. Before public launch, configure HTTPS and trusted CORS origins; add managed identity and role-based access; persist user data in PostgreSQL/PostGIS; add upload scanning, rate limits, audit logs, backups, monitoring and CI; validate each scientific indicator with domain experts; and complete accessibility, privacy and security reviews. Do not publish illustrative KPI tiles as measured environmental facts.
