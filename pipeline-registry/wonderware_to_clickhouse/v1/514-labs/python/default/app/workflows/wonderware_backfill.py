"""
Wonderware Backfill Workflow

Historical data sync workflow that discovers tags, chunks date ranges,
fetches data from Wonderware SQL Server, and inserts into ClickHouse.
"""

from moose_lib import Task, TaskConfig, TaskContext, Workflow, WorkflowConfig
from wonderware import WonderwareConnector
from app.config.wonderware_config import PipelineConfig
from app.workflows.lib.wonderware_inserter import WonderwareBatchInserter
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Tuple
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# Input/Output Models
# ============================================================================

class BackfillInput(BaseModel):
    """Initial workflow input"""
    oldest_time: str = '2025-01-01 00:00:00'


class DiscoverTagsOutput(BaseModel):
    """Output from tag discovery"""
    tags: List[str]
    oldest_time: str


class ChunkDateRangesOutput(BaseModel):
    """Output from date range chunking"""
    tags: List[str]
    oldest_time: str
    date_ranges: List[Tuple[str, str]]
    tag_chunks: List[List[str]]


class FetchAndInsertOutput(BaseModel):
    """Output from fetch and insert"""
    total_rows: int
    processed_chunks: int


class FinalizeOutput(BaseModel):
    """Final workflow output"""
    status: str
    completion_time: str
    total_rows: int
    processed_chunks: int


# ============================================================================
# Task Functions
# ============================================================================

def run_discover_tags(ctx: TaskContext[BackfillInput]) -> DiscoverTagsOutput:
    """Discover all active tags from Wonderware TagRef table."""

    oldest_time = ctx.input.oldest_time
    connector = WonderwareConnector.build_from_env()

    try:
        tags = connector.discover_tags()
        logger.info(f"Discovered {len(tags)} tags to backfill")

        return DiscoverTagsOutput(
            tags=tags,
            oldest_time=oldest_time
        )
    finally:
        connector.close()


def run_chunk_date_ranges(ctx: TaskContext[DiscoverTagsOutput]) -> ChunkDateRangesOutput:
    """Split date range into chunks for backfill processing."""

    tags = ctx.input.tags
    oldest_time = datetime.fromisoformat(ctx.input.oldest_time)
    current_time = datetime.now()
    pipeline_config = PipelineConfig.from_env()

    # Generate date ranges based on config
    date_ranges = []
    current = oldest_time
    while current < current_time:
        next_date = min(current + timedelta(days=pipeline_config.backfill_chunk_days), current_time)
        date_ranges.append((current.isoformat(), next_date.isoformat()))
        current = next_date

    # Chunk tags based on config
    tag_chunks = [tags[i:i+pipeline_config.tag_chunk_size] for i in range(0, len(tags), pipeline_config.tag_chunk_size)]

    total_work = len(date_ranges) * len(tag_chunks)
    logger.info(f"Created {len(date_ranges)} date ranges and {len(tag_chunks)} tag chunks")
    logger.info(f"Total work units: {total_work}")

    return ChunkDateRangesOutput(
        tags=tags,
        oldest_time=ctx.input.oldest_time,
        date_ranges=date_ranges,
        tag_chunks=tag_chunks
    )


def run_fetch_and_insert(ctx: TaskContext[ChunkDateRangesOutput]) -> FetchAndInsertOutput:
    """Fetch historical data from Wonderware and insert into ClickHouse."""

    date_ranges = ctx.input.date_ranges
    tag_chunks = ctx.input.tag_chunks

    connector = WonderwareConnector.build_from_env()
    inserter = WonderwareBatchInserter()

    total_rows = 0
    total_chunks = len(date_ranges) * len(tag_chunks)
    processed = 0

    try:
        for date_from, date_to in date_ranges:
            for tag_chunk in tag_chunks:
                processed += 1
                logger.info(
                    f"Processing chunk {processed}/{total_chunks}: "
                    f"{date_from} - {date_to}, tags: {len(tag_chunk)}"
                )

                # Fetch data with inclusive start (BETWEEN)
                rows = connector.fetch_history_data(tag_chunk, date_from, date_to, inclusive_start=True)

                if rows:
                    inserted = inserter.insert_rows(rows)
                    total_rows += inserted
                    logger.info(f"Inserted {inserted} rows")

        logger.info(f"Backfill complete: {total_rows:,} total rows inserted")

        return FetchAndInsertOutput(
            total_rows=total_rows,
            processed_chunks=processed
        )
    finally:
        connector.close()


def run_finalize(ctx: TaskContext[FetchAndInsertOutput]) -> FinalizeOutput:
    """Log backfill completion."""

    completion_time = datetime.now().isoformat()

    logger.info("=" * 60)
    logger.info("BACKFILL COMPLETE")
    logger.info("=" * 60)
    logger.info(f"Total rows inserted: {ctx.input.total_rows:,}")
    logger.info(f"Processed chunks: {ctx.input.processed_chunks}")
    logger.info(f"Completion time: {completion_time}")
    logger.info("=" * 60)

    return FinalizeOutput(
        status="completed",
        completion_time=completion_time,
        total_rows=ctx.input.total_rows,
        processed_chunks=ctx.input.processed_chunks
    )


# ============================================================================
# Task and Workflow Definitions
# ============================================================================

# Task 4: Finalize
finalize_task = Task[FetchAndInsertOutput, FinalizeOutput](
    name="finalize",
    config=TaskConfig(run=run_finalize)
)

# Task 3: Fetch and Insert (chains to finalize)
fetch_and_insert_task = Task[ChunkDateRangesOutput, FetchAndInsertOutput](
    name="fetch_and_insert",
    config=TaskConfig(
        run=run_fetch_and_insert,
        on_complete=[finalize_task]
    )
)

# Task 2: Chunk Date Ranges (chains to fetch_and_insert)
chunk_date_ranges_task = Task[DiscoverTagsOutput, ChunkDateRangesOutput](
    name="chunk_date_ranges",
    config=TaskConfig(
        run=run_chunk_date_ranges,
        on_complete=[fetch_and_insert_task]
    )
)

# Task 1: Discover Tags (starting task, chains to chunk_date_ranges)
discover_tags_task = Task[BackfillInput, DiscoverTagsOutput](
    name="discover_tags",
    config=TaskConfig(
        run=run_discover_tags,
        on_complete=[chunk_date_ranges_task]
    )
)

# Workflow Definition
wonderware_backfill = Workflow(
    name="wonderware_backfill",
    config=WorkflowConfig(
        starting_task=discover_tags_task,
        schedule="",  # Manual trigger only
        retries=3,
        timeout="24h"
    )
)
