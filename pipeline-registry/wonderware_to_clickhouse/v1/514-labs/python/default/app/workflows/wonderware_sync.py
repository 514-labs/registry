"""
Wonderware Current Sync Workflow

Incremental sync workflow that runs every 1 minute to fetch new data
from Wonderware SQL Server and insert into ClickHouse.
"""

from moose_lib import Task, TaskConfig, TaskContext, Workflow, WorkflowConfig, MooseClient
from wonderware import WonderwareConnector
from app.config.wonderware_config import PipelineConfig
from app.workflows.lib.wonderware_inserter import WonderwareBatchInserter
from app.ingest.wonderware_models import WonderwareHistoryTable
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import logging
import redis

logger = logging.getLogger(__name__)


# ============================================================================
# Input/Output Models
# ============================================================================

class SyncOutput(BaseModel):
    """Output from sync task"""
    last_max_time: str
    new_rows: int
    sync_time: str


# ============================================================================
# Task Function
# ============================================================================

def run_sync_current(ctx: TaskContext[None]) -> SyncOutput:
    """Sync recent data from Wonderware to ClickHouse (runs every 1 minute)."""

    pipeline_config = PipelineConfig.from_env()
    connector = WonderwareConnector.build_from_env()
    inserter = WonderwareBatchInserter()
    moose_client = MooseClient()
    redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

    try:
        # Get last max timestamp from ClickHouse (watermark)
        last_max_time = _get_last_max_timestamp(moose_client)

        # If no data exists, start from 1 hour ago
        if not last_max_time:
            last_max_time = datetime.now() - timedelta(hours=1)
            logger.warning(f"No data found in ClickHouse, syncing from {last_max_time}")

        logger.info(f"Syncing data newer than {last_max_time}")

        # Get all tags (cached in Redis)
        tags = _get_cached_tags(connector, redis_client, pipeline_config.tag_cache_ttl)

        # Fetch new data for all tags
        total_rows = 0
        tag_chunks = [tags[i:i+pipeline_config.tag_chunk_size] for i in range(0, len(tags), pipeline_config.tag_chunk_size)]
        current_time = datetime.now()

        for tag_chunk in tag_chunks:
            # Fetch with exclusive start (>)
            rows = connector.fetch_history_data(
                tag_chunk,
                last_max_time.isoformat(),
                current_time.isoformat(),
                inclusive_start=False
            )

            if rows:
                inserted = inserter.insert_rows(rows)
                total_rows += inserted

        logger.info(f"Sync complete: {total_rows} new rows inserted")

        return SyncOutput(
            last_max_time=last_max_time.isoformat(),
            new_rows=total_rows,
            sync_time=current_time.isoformat()
        )
    finally:
        connector.close()


# ============================================================================
# Helper Functions
# ============================================================================

def _get_cached_tags(connector: WonderwareConnector, redis_client, ttl: int) -> list[str]:
    """
    Get all active tags with Redis caching.

    Args:
        connector: WonderwareConnector instance
        redis_client: Redis client instance
        ttl: Cache TTL in seconds

    Returns:
        List of tag names (cached for ttl seconds)
    """
    cache_key = 'MS:wonderware:tags:list'

    # Try cache first
    cached_tags = redis_client.get(cache_key)
    if cached_tags:
        logger.debug(f"Retrieved {len(cached_tags.split(','))} tags from cache")
        return cached_tags.split(',')

    # Fetch from database via connector
    tags = connector.discover_tags()

    # Cache for configured TTL
    if tags:
        redis_client.setex(cache_key, ttl, ','.join(tags))

    return tags


def _get_last_max_timestamp(client: MooseClient) -> Optional[datetime]:
    """Get the latest DateTime from ClickHouse (watermark)."""
    try:
        query = """
            SELECT max(DateTime) AS max_time
            FROM {table}
        """
        result = client.query.execute(query, {"table": WonderwareHistoryTable})
        if result and len(result) > 0 and result[0].get('max_time'):
            return result[0]['max_time']
    except Exception as e:
        logger.error(f"Error querying max timestamp: {e}")
    return None


# ============================================================================
# Task and Workflow Definitions
# ============================================================================

# Sync Task (single task workflow)
sync_current_task = Task[None, SyncOutput](
    name="sync_current",
    config=TaskConfig(run=run_sync_current)
)

# Workflow Definition
wonderware_current_sync = Workflow(
    name="wonderware_current_sync",
    config=WorkflowConfig(
        starting_task=sync_current_task,
        schedule="*/1 * * * *",  # Every 1 minute
        retries=3,
        timeout="5m"
    )
)
