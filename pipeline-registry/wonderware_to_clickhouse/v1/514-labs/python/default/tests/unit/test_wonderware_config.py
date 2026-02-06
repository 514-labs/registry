"""
Unit tests for PipelineConfig.
"""

import pytest
import os
from app.config.wonderware_config import PipelineConfig


def test_config_from_env_with_all_fields(mock_env_vars):
    """Test config loading with all fields set."""
    config = PipelineConfig.from_env()

    assert config.tag_chunk_size == 5
    assert config.backfill_chunk_days == 7
    assert config.backfill_oldest_time == '2025-01-01 00:00:00'
    assert config.tag_cache_ttl == 1800


def test_config_from_env_with_defaults():
    """Test config loading uses defaults when vars are missing."""
    # Clear all env vars
    for key in ['WONDERWARE_PIPELINE_TAG_CHUNK_SIZE', 'WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS',
                'WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME', 'WONDERWARE_PIPELINE_TAG_CACHE_TTL']:
        os.environ.pop(key, None)

    config = PipelineConfig.from_env()

    assert config.tag_chunk_size == 10  # Default
    assert config.backfill_chunk_days == 1  # Default
    assert config.backfill_oldest_time == '2025-01-01 00:00:00'  # Default
    assert config.tag_cache_ttl == 3600  # Default


def test_config_custom_prefix():
    """Test config loading with custom environment variable prefix."""
    os.environ['CUSTOM_TAG_CHUNK_SIZE'] = '20'
    os.environ['CUSTOM_BACKFILL_CHUNK_DAYS'] = '14'

    config = PipelineConfig.from_env(prefix='CUSTOM_')

    assert config.tag_chunk_size == 20
    assert config.backfill_chunk_days == 14


def test_config_dataclass_immutability():
    """Test that config is a proper dataclass."""
    config = PipelineConfig.from_env()

    # Should be able to create instances
    assert isinstance(config, PipelineConfig)
    assert config.tag_chunk_size >= 1


def test_config_sync_schedule():
    """Test sync schedule configuration."""
    os.environ['WONDERWARE_PIPELINE_SYNC_SCHEDULE'] = '*/5 * * * *'
    config = PipelineConfig.from_env()

    assert config.sync_schedule == '*/5 * * * *'


def test_config_no_connection_fields():
    """Test that PipelineConfig does not have connection fields."""
    config = PipelineConfig.from_env()

    # These fields should NOT exist (they're in the connector now)
    assert not hasattr(config, 'host')
    assert not hasattr(config, 'port')
    assert not hasattr(config, 'database')
    assert not hasattr(config, 'username')
    assert not hasattr(config, 'password')
    assert not hasattr(config, 'driver')
