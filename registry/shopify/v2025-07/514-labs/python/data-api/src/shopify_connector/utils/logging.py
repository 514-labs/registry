import logging
from typing import Any, Dict


def setup_logging(config: Dict[str, Any] | None) -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
