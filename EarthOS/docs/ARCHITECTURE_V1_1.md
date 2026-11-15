# EarthOS Architecture — v1.1

## Product principles
- Every environmental metric must expose its source, period, unit, spatial scale and limitations.
- Distinguish measured field observations, satellite/reanalysis estimates, derived indicators and forecasts.
- Never present illustrative dashboard values as live global measurements.
- Recommendations affecting crops, water, insurance or public safety require local validation and qualified review.

## Current working components
- `frontend/`: Persian/English responsive single-page workspace, Leaflet map and NASA POWER visualization.
- `backend/`: FastAPI application, health endpoint, data catalog and NASA POWER connector.
- `data/`: sample geospatial data and designated raw/processed storage locations.
- `models/`: reserved for versioned, evaluated model artifacts; no production-trained model is bundled.
- `scripts/`: reproducible data download and exploratory calculations.
- `deploy/`: Nginx reverse proxy configuration; Docker Compose deployment for local evaluation.
- `tests/`: API surface contract tests.

## API
- `GET /health`: process health.
- `GET /api/catalog`: available and planned data products.
- `GET /api/nasa/power?latitude=...&longitude=...&days=30`: NASA POWER daily values, limited to 7–365 days.
- `GET /docs`: interactive OpenAPI documentation.

NASA POWER daily data can have a publication delay. The API excludes fill values and returns source, date range, units and a caveat. Its latest valid daily value is not necessarily today's observation.

## Next architecture milestones
1. Persistence: PostgreSQL + PostGIS, migrations, tenant-aware access controls and audit events.
2. Geospatial ingestion: scheduled connector workers, object storage, STAC metadata, checksums and provenance.
3. Raster analytics: reproducible NDVI/land-surface-temperature/soil-water pipelines with cloud masks and spatial resolution metadata.
4. Identity and security: OIDC, role-based authorization, rate limits, secrets manager, backups and security review.
5. Model registry: dataset cards, training/evaluation splits, calibration, drift monitoring, uncertainty and human review.
6. Field operations: consent-aware uploads, offline-first sync, location precision controls and data-quality review.
7. Reliability: observability, structured logs, metrics, traces, CI/CD, disaster recovery and load tests.

## Explicitly not implemented in v1.1
Plant-disease CNN inference, drought forecasting, global Earth-health scoring, voice assistant, carbon-credit issuance/trading, parametric insurance payouts, blockchain provenance, public social network, GRACE-FO/GLDAS/MODIS/SWOT/NISAR pipelines and a global digital twin. They remain roadmap items until datasets, models, validation and governance exist.
