from dataclasses import dataclass

@dataclass
class PipelineConfig:
    cron: str | None = None
    timezone: str | None = None
