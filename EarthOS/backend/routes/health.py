from fastapi import APIRouter
from backend import __version__

router = APIRouter(tags=["System"])

@router.get("/health")
async def health():
    return {"status": "ok", "service": "EarthOS API", "version": __version__}
