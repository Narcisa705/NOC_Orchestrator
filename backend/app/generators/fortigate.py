from app.schemas.domain import DeviceIntent


def generate_fortigate(data: DeviceIntent) -> str:
    lines = [
        f"# Full Migration for {data.hostname}",
        "config system global",
        f'    set hostname "{data.hostname}"',
        "end",
        "",
        "config system interface"
    ]

    generated_interfaces = set()

    for iface in data.interfaces:
        interface_name = f'vlan{iface.vlan}'

        if interface_name in generated_interfaces:
            continue

        lines.append(f'    edit "{interface_name}"')
        lines.append(f'        set alias "{iface.description}"')
        lines.append(f"        set ip {iface.ip} {iface.mask}")
        lines.append("        set status down" if iface.shutdown else "        set status up")
        lines.append("    next")
        generated_interfaces.add(interface_name)

    lines.append("end")

    if data.static_routes:
        lines.append("")
        lines.append("config router static")
        for index, route in enumerate(data.static_routes, start=1):
            lines.append(f"    edit {index}")
            lines.append(f"        set dst {route.destination} {route.mask}")
            lines.append(f"        set gateway {route.gateway}")
            lines.append("    next")
        lines.append("end")

    return "\n".join(lines)