from collections import Counter
from app.schemas.domain import DeviceIntent, WarningModel


def validate_device_intent(data: DeviceIntent) -> DeviceIntent:
    warnings = list(data.warnings)

    if not data.interfaces:
        warnings.append(
            WarningModel(
                code="NO_INTERFACES",
                message="Nu au fost detectate interfețe L3.",
                severity="warning"
            )
        )

    if not data.static_routes:
        warnings.append(
            WarningModel(
                code="NO_STATIC_ROUTES",
                message="Nu au fost detectate rute statice.",
                severity="info"
            )
        )

    ip_counts = Counter(iface.ip for iface in data.interfaces)
    duplicates = [ip for ip, count in ip_counts.items() if count > 1]

    for ip in duplicates:
        warnings.append(
            WarningModel(
                code="DUPLICATE_IP",
                message=f"IP duplicat detectat: {ip}",
                severity="error"
            )
        )

    data.warnings = warnings
    return data