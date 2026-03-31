import re

from app.parsers.base import BaseParser
from app.schemas.domain import DeviceIntent, InterfaceModel, StaticRouteModel
from app.core.utils import sanitize_text, mask_to_prefix, extract_vlan_from_name


class HuaweiParser(BaseParser):
    def parse(self, raw_config: str) -> DeviceIntent:
        data = DeviceIntent()

        host_match = re.search(r"^sysname\s+(\S+)", raw_config, re.MULTILINE)
        if host_match:
            data.hostname = host_match.group(1)

        interface_blocks = re.findall(
            r"(^interface\s+[^\n]+[\s\S]*?)(?=^interface\s+[^\n]+|^#|\Z)",
            raw_config,
            re.MULTILINE
        )

        for block in interface_blocks:
            name_match = re.search(r"^interface\s+([^\n]+)", block, re.MULTILINE)
            if not name_match:
                continue

            interface_name = name_match.group(1).strip()
            desc_match = re.search(r"^\s*description\s+(.+)$", block, re.MULTILINE)
            ip_match = re.search(
                r"^\s*ip address\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)$",
                block,
                re.MULTILINE
            )
            shutdown_match = re.search(r"^\s*shutdown\s*$", block, re.MULTILINE)

            if not ip_match:
                continue

            vlan_id = extract_vlan_from_name(interface_name)

            data.interfaces.append(
                InterfaceModel(
                    name=interface_name,
                    original_name=interface_name,
                    description=sanitize_text(desc_match.group(1) if desc_match else "Migrated"),
                    ip=ip_match.group(1),
                    mask=ip_match.group(2),
                    prefix=mask_to_prefix(ip_match.group(2)),
                    vlan=vlan_id if vlan_id else "1",
                    shutdown=bool(shutdown_match),
                )
            )

        route_pattern = r"^ip route-static\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)"
        route_matches = re.findall(route_pattern, raw_config, re.MULTILINE)

        for route in route_matches:
            data.static_routes.append(
                StaticRouteModel(
                    destination=route[0],
                    mask=route[1],
                    prefix=mask_to_prefix(route[1]),
                    gateway=route[2],
                )
            )

        return data