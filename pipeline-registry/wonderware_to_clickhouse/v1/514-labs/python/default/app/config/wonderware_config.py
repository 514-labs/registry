import os
from dataclasses import dataclass


@dataclass
class PipelineConfig:
    """Configuration for Wonderware to ClickHouse pipeline."""

    # Processing configuration
    tag_chunk_size: int = 10                      # Number of tags to fetch at once
    backfill_chunk_days: int = 1                  # Days per backfill chunk
    sync_schedule: str = "*/1 * * * *"            # Cron for incremental sync (1-minute)
    backfill_oldest_time: str = "2025-01-01 00:00:00"  # Start of historical data

    # Caching
    tag_cache_ttl: int = 3600                     # Seconds to cache tag list in Redis

    @staticmethod
    def from_env(prefix: str = "WONDERWARE_PIPELINE_") -> "PipelineConfig":
        """
        Load pipeline configuration from environment variables.

        Args:
            prefix: Environment variable prefix (default: "WONDERWARE_PIPELINE_")

        Returns:
            PipelineConfig instance
        """
        return PipelineConfig(
            tag_chunk_size=int(os.getenv(f"{prefix}TAG_CHUNK_SIZE", "10")),
            backfill_chunk_days=int(os.getenv(f"{prefix}BACKFILL_CHUNK_DAYS", "1")),
            sync_schedule=os.getenv(f"{prefix}SYNC_SCHEDULE", "*/1 * * * *"),
            backfill_oldest_time=os.getenv(f"{prefix}BACKFILL_OLDEST_TIME", "2025-01-01 00:00:00"),
            tag_cache_ttl=int(os.getenv(f"{prefix}TAG_CACHE_TTL", "3600")),
        )
