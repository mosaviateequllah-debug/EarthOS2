from pydantic import BaseModel, Field
from typing import Optional

class FieldObservation(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    location: str = Field(min_length=2, max_length=160)
    observation_type: str
    notes: Optional[str] = Field(default=None, max_length=3000)
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
