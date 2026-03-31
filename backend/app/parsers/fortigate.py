import re

from app.parsers.base import BaseParser
from app.schemas.domain import DeviceIntent, InterfaceModel, StaticRouteModel
from app.core.utils import sanitize_text, mask_to_prefix, extract_vlan_from_name


class FortiGateParser(BaseParser):
    def parse(self, raw_config: str) -> DeviceIntent:
        data = DeviceIntent()

        host_match = re.search(r'set hostname "([^"]+)"', raw_config)
        if host_match:
            data.hostname = host_match.group(1)

        interface_blocks = re.findall(
            r'edit\s+"([^"]+)"([\s\S]*?)\s+next',
            raw_config,
            re.IGNORECASE
        )

        for interface_name, block in interface_blocks:
            ip_match = re.search(
                r"set ip\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)",
                block
            )
            alias_match = re.search(r'set alias "([^"]+)"', block)
            status_down = re.search(r"set status down", block, re.IGNORECASE)

            if not ip_match:
                continue

            vlan_id = extract_vlan_from_name(interface_name)

            data.interfaces.append(
                InterfaceModel(
                    name=interface_name,
                    original_name=interface_name,
                    description=sanitize_text(alias_match.group(1) if alias_match else "Migrated"),
                    ip=ip_match.group(1),
                    mask=ip_match.group(2),
                    prefix=mask_to_prefix(ip_match.group(2)),
                    vlan=vlan_id if vlan_id else "1",
                    shutdown=bool(status_down),
                )
            )

        route_blocks = re.findall(
            r"edit\s+\d+([\s\S]*?)\s+next",
            raw_config,
            re.IGNORECASE
        )

        for block in route_blocks:
            dst_match = re.search(
                r"set dst\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)",
                block
            )
            gw_match = re.search(r"set gateway\s+(\d+\.\d+\.\d+\.\d+)", block)

            if dst_match and gw_match:
                data.static_routes.append(
                    StaticRouteModel(
                        destination=dst_match.group(1),
                        mask=dst_match.group(2),
                        prefix=mask_to_prefix(dst_match.group(2)),
                        gateway=gw_match.group(1),
                    )
                )

        return data