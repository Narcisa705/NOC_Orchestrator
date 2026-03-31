from typing import List, Literal, Optional
from pydantic import BaseModel, Field


VendorType = Literal["cisco", "huawei", "fortigate", "unknown"]


class InterfaceModel(BaseModel):
    name: str
    description: str = "Migrated"
    ip: str
    mask: str
    prefix: int
    vlan: str = "1"
    shutdown: bool = False
    original_name: Optional[str] = None


class StaticRouteModel(BaseModel):
    destination: str
    mask: str
    prefix: int
    gateway: str


class WarningModel(BaseModel):
    code: str
    message: str
    severity: Literal["info", "warning", "error"] = "warning"


class DeviceIntent(BaseModel):
    hostname: str = "Network_Device"
    interfaces: List[InterfaceModel] = Field(default_factory=list)
    static_routes: List[StaticRouteModel] = Field(default_factory=list)
    warnings: List[WarningModel] = Field(default_factory=list)