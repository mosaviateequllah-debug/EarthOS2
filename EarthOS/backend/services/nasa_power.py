"""NASA POWER client. Returned values are observations/derived summaries, never forecasts."""
from datetime import date, timedelta
from typing import Any
import httpx

NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
PARAMETERS = "T2M,PRECTOTCORR,RH2M"

async def fetch_power(latitude: float, longitude: float, days: int = 30) -> dict[str, Any]:
    end = date.today() - timedelta(days=5)  # Daily product publication lag.
    start = end - timedelta(days=days - 1)
    params = {
        "parameters": PARAMETERS, "community": "AG", "longitude": longitude,
        "latitude": latitude, "start": start.strftime("%Y%m%d"),
        "end": end.strftime("%Y%m%d"), "format": "JSON",
    }
    async with httpx.AsyncClient(timeout=httpx.Timeout(40.0, connect=10.0)) as client:
        response = await client.get(NASA_POWER_URL, params=params)
        response.raise_for_status()
        payload = response.json()
    raw = payload.get("properties", {}).get("parameter", {})
    series: dict[str, list[dict[str, Any]]] = {}
    latest: dict[str, float | None] = {}
    for parameter in PARAMETERS.split(","):
        values = raw.get(parameter, {})
        points = []
        for day, value in sorted(values.items()):
            if isinstance(value, (int, float)) and value > -900:
                points.append({"date": f"{day[:4]}-{day[4:6]}-{day[6:]}", "value": value})
        series[parameter] = points
        latest[parameter] = points[-1]["value"] if points else None
    return {
        "source": "NASA POWER Daily Point API", "source_url": NASA_POWER_URL,
        "start": start.isoformat(), "end": end.isoformat(),
        "latitude": latitude, "longitude": longitude,
        "parameters": latest, "series": series,
        "units": {"T2M": "°C", "PRECTOTCORR": "mm/day", "RH2M": "%"},
        "quality": {"status": "source_values_returned", "missing_values_excluded": True},
        "note": "Historical daily estimates from NASA POWER; not a forecast or field measurement. Validate locally before operational decisions.",
    }
