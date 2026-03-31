from app.core.detector import detect_vendor
from app.core.validators import validate_device_intent
from app.parsers.cisco import CiscoParser
from app.parsers.huawei import HuaweiParser
from app.parsers.fortigate import FortiGateParser
from app.generators.cisco import generate_cisco
from app.generators.huawei import generate_huawei
from app.generators.fortigate import generate_fortigate


class OrchestratorService:
    def __init__(self):
        self.cisco_parser = CiscoParser()
        self.huawei_parser = HuaweiParser()
        self.fortigate_parser = FortiGateParser()

    def analyze(self, raw_config: str, source_vendor: str = "unknown"):
        detection = detect_vendor(raw_config)
        vendor = source_vendor if source_vendor != "unknown" else detection.vendor

        if vendor == "cisco":
            data = self.cisco_parser.parse(raw_config)
        elif vendor == "huawei":
            data = self.huawei_parser.parse(raw_config)
        elif vendor == "fortigate":
            data = self.fortigate_parser.parse(raw_config)
        else:
            raise ValueError("Vendorul nu a putut fi detectat.")

        data = validate_device_intent(data)
        return vendor, detection.confidence, data

    def generate(self, data, target_vendor: str):
        if target_vendor == "cisco":
            return generate_cisco(data)
        if target_vendor == "huawei":
            return generate_huawei(data)
        if target_vendor == "fortigate":
            return generate_fortigate(data)

        raise ValueError(f"Generator neimplementat pentru: {target_vendor}")