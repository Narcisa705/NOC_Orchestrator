import re
from typing import Optional


def sanitize_text(value: Optional[str], default: str = "") -> str:
    if not value:
        return default
    return value.strip().replace('"', "'")


def mask_to_prefix(mask: str) -> int:
    parts = mask.split(".")
    if len(parts) != 4:
        raise ValueError(f"Invalid subnet mask: {mask}")

    try:
        binary = "".join(f"{int(part):08b}" for part in parts)
    except ValueError as exc:
        raise ValueError(f"Invalid subnet mask: {mask}") from exc

    if "01" in binary:
        raise ValueError(f"Invalid subnet mask: {mask}")

    return binary.count("1")


def prefix_to_mask(prefix: int) -> str:
    if prefix < 0 or prefix > 32:
        raise ValueError(f"Invalid prefix: {prefix}")

    binary = "1" * prefix + "0" * (32 - prefix)
    return ".".join(str(int(binary[i:i+8], 2)) for i in range(0, 32, 8))


def extract_vlan_from_name(interface_name: str) -> Optional[str]:
    svi_match = re.match(r"Vlan(?:if)?\s*(\d+)", interface_name, re.IGNORECASE)
    if svi_match:
        return svi_match.group(1)

    subif_match = re.search(r"\.(\d+)$", interface_name)
    if subif_match:
        return subif_match.group(1)

    vlan_match = re.search(r"vlan(\d+)", interface_name, re.IGNORECASE)
    if vlan_match:
        return vlan_match.group(1)

    return None