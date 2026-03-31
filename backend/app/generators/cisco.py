from app.schemas.domain import DeviceIntent
from app.core.constants import CISCO_BASE
from app.core.constants import CISCO_FOOTER

def generate_cisco(data: DeviceIntent) -> str:
    # Începem cu template-ul fix (partea de SSH, logging, etc.)
    lines = [CISCO_BASE]

    # Adăugăm partea dinamică extrasă din config-ul vechi
    lines.append(f"hostname {data.hostname}")

    generated_vlans = set()

    for iface in data.interfaces:
        vlan_id = iface.vlan

        if vlan_id in generated_vlans:
            continue

        lines.append(f"interface Vlan{vlan_id}")
        lines.append(f" description {iface.description}")
        lines.append(f" ip address {iface.ip} {iface.mask}")
        lines.append(" shutdown" if iface.shutdown else " no shutdown")
        lines.append("!")
        generated_vlans.add(vlan_id)

    for route in data.static_routes:
        lines.append(f"ip route {route.destination} {route.mask} {route.gateway}")
    lines.append(CISCO_FOOTER)
    return "\n".join(lines)