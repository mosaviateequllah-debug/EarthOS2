from fastapi import APIRouter, HTTPException, Query
import httpx
from backend.services.nasa_power import fetch_power

router = APIRouter(prefix="/api/nasa", tags=["NASA data"])

@router.get("/power")
async def nasa_power(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    days: int = Query(30, ge=7, le=365),
):
    try:
        return await fetch_power(latitude, longitude, days)
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="NASA POWER data could not be retrieved. Try again later.") from exc
