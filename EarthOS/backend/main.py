import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend import __version__
from backend.routes.nasa import router as nasa_router
from backend.routes.health import router as health_router

app = FastAPI(
    title="EarthOS Platform API",
    description="Earth observation and climate-data services. Source observations are distinguished from estimates, model outputs and forecasts.",
    version=__version__,
    docs_url="/docs",
    redoc_url="/redoc",
)
origins = [x.strip() for x in os.getenv("EARTHOS_CORS_ORIGINS", "http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:8000").split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"],
)
app.include_router(health_router)
app.include_router(nasa_router)

@app.get("/")
async def root():
    return {"name": "EarthOS", "version": app.version, "docs": "/docs", "health": "/health", "api_policy": "Source attribution and uncertainty are required for derived products."}

@app.get("/api/catalog")
async def data_catalog():
    return {
        "platform": "EarthOS", "version": app.version,
        "available": [{"id": "nasa-power-daily-point", "provider": "NASA POWER", "endpoint": "/api/nasa/power", "variables": ["T2M", "PRECTOTCORR", "RH2M"], "temporal_resolution": "daily", "status": "live integration", "limitations": "Gridded/reanalysis-derived estimates; not a field sensor or forecast."}],
        "planned": ["MODIS vegetation indices", "GLDAS soil moisture", "GRACE-FO terrestrial water storage", "SWOT surface water", "field observations"],
    }
