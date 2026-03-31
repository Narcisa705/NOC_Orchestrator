from abc import ABC, abstractmethod
from app.schemas.domain import DeviceIntent


class BaseParser(ABC):
    @abstractmethod
    def parse(self, raw_config: str) -> DeviceIntent:
        raise NotImplementedError