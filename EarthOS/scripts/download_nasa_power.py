"""Download a daily NASA POWER CSV sample for Jaghori pilot coordinates."""
from datetime import date, timedelta
from pathlib import Path
import httpx

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "raw" / "jaghori_nasa_power.csv"
END = date.today() - timedelta(days=5)
START = END - timedelta(days=365)
params = {
    "parameters": "T2M,PRECTOTCORR,RH2M",
    "community": "AG", "longitude": 67.4638, "latitude": 33.1434,
    "start": START.strftime("%Y%m%d"), "end": END.strftime("%Y%m%d"),
    "format": "CSV"
}
response = httpx.get("https://power.larc.nasa.gov/api/temporal/daily/point", params=params, timeout=60)
response.raise_for_status()
OUT.write_text(response.text, encoding="utf-8")
print(f"Saved: {OUT}")
