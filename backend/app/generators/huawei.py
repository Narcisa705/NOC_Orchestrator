from app.schemas.domain import DeviceIntent


def generate_huawei(data: DeviceIntent) -> str:
    lines = [
        f"# Full Migration for {data.hostname}",
        "system-view",
        f"sysname {data.hostname}"
    ]

    generated_vlans = set()
    generated_vlanifs = set()

    for iface in data.interfaces:
        vlan_id = iface.vlan

        if vlan_id not in generated_vlans:
            lines.append(f"vlan {vlan_id}")
            generated_vlans.add(vlan_id)

        if vlan_id not in generated_vlanifs:
            lines.append(f"interface Vlanif {vlan_id}")
            lines.append(f" description {iface.description}")
            lines.append(f" ip address {iface.ip} {iface.mask}")
            if iface.shutdown:
                lines.append(" shutdown")
            generated_vlanifs.add(vlan_id)

    for route in data.static_routes:
        lines.append(f"ip route-static {route.destination} {route.mask} {route.gateway}")

    return "\n".join(lines)