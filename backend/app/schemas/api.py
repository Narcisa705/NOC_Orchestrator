from typing import Literal
from pydantic import BaseModel, Field

from app.schemas.domain import DeviceIntent, VendorType


class AnalyzeRequest(BaseModel):
    raw_config: str = Field(min_length=10)
    source_vendor: VendorType = "unknown"


class AnalyzeResponse(BaseModel):
    detected_vendor: VendorType
    confidence: float
    data: DeviceIntent


class ConvertRequest(BaseModel):
    raw_config: str = Field(min_length=10)
    source_vendor: VendorType = "unknown"
    target_vendor: Literal["cisco", "huawei", "fortigate"]


class ConvertResponse(BaseModel):
    detected_vendor: VendorType
    confidence: float
    target_vendor: str
    data: DeviceIntent
    generated_config: str