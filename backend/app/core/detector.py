import re
from dataclasses import dataclass


@dataclass
class DetectionResult:
    vendor: str
    confidence: float


def detect_vendor(raw_config: str) -> DetectionResult:
    text = raw_config
    scores = {
        "cisco": 0,
        "huawei": 0,
        "fortigate": 0,
    }

    if re.search(r"config system interface", text, re.IGNORECASE):
        scores["fortigate"] += 3
    if re.search(r"config router static", text, re.IGNORECASE):
        scores["fortigate"] += 3
    if re.search(r'set hostname ".*"', text, re.IGNORECASE):
        scores["fortigate"] += 2

    if re.search(r"^sysname\s+\S+", text, re.MULTILINE):
        scores["huawei"] += 3
    if re.search(r"^interface\s+Vlanif\s+\d+", text, re.MULTILINE | re.IGNORECASE):
        scores["huawei"] += 3
    if re.search(r"^ip route-static\s+", text, re.MULTILINE):
        scores["huawei"] += 2

    if re.search(r"^hostname\s+\S+", text, re.MULTILINE):
        scores["cisco"] += 3
    if re.search(r"^interface\s+\S+", text, re.MULTILINE):
        scores["cisco"] += 1
    if re.search(r"^ip route\s+", text, re.MULTILINE):
        scores["cisco"] += 2

    best_vendor = max(scores, key=scores.get)
    best_score = scores[best_vendor]

    if best_score == 0:
        return DetectionResult(vendor="unknown", confidence=0.0)

    total = sum(scores.values())
    confidence = round(best_score / total, 2) if total else 0.0
    return DetectionResult(vendor=best_vendor, confidence=confidence)