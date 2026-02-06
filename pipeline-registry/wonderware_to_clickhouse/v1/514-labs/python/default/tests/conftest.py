"""
Pytest configuration and fixtures for Wonderware pipeline tests.
"""

import pytest
import os
from unittest.mock import MagicMock


@pytest.fixture
def mock_env_vars():
    """Set up mock environment variables for testing."""
    env_vars = {
        'WONDERWARE_PIPELINE_TAG_CHUNK_SIZE': '5',
        'WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS': '7',
        'WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME': '2025-01-01 00:00:00',
        'WONDERWARE_PIPELINE_TAG_CACHE_TTL': '1800',
    }

    # Store original values
    original_values = {}
    for key, value in env_vars.items():
        original_values[key] = os.environ.get(key)
        os.environ[key] = value

    yield env_vars

    # Restore original values
    for key, original in original_values.items():
        if original is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = original


@pytest.fixture
def mock_sqlalchemy_engine():
    """Mock SQLAlchemy engine for testing."""
    mock_engine = MagicMock()
    mock_connection = MagicMock()
    mock_engine.connect.return_value.__enter__.return_value = mock_connection
    return mock_engine


@pytest.fixture
def mock_redis_client():
    """Mock Redis client for testing."""
    mock_redis = MagicMock()
    mock_redis.get.return_value = None
    mock_redis.setex.return_value = True
    return mock_redis


@pytest.fixture
def sample_wonderware_rows():
    """Sample Wonderware history data for testing."""
    return [
        {
            'DateTime': '2025-02-06 12:00:00',
            'TagName': 'TagA',
            'Value': 123.45,
            'VValue': None,
            'Quality': 192,
            'QualityDetail': 0,
            'OpcQuality': None,
            'wwTagKey': 1,
            'wwRowCount': 1,
            'wwResolution': 1,
            'wwEdgeDetection': None,
            'wwRetrievalMode': 'Delta',
            'wwTimeDeadband': None,
            'wwValueDeadband': None,
            'wwTimeZone': None,
            'wwVersion': None,
            'wwCycleCount': None,
            'wwTimeStampRule': None,
            'wwInterpolationType': None,
            'wwQualityRule': None,
            'wwStateCalc': None,
            'StateTime': None,
            'PercentGood': None,
            'wwParameters': None,
            'StartDateTime': None,
            'SourceTag': None,
            'SourceServer': None,
            'wwFilter': None,
            'wwValueSelector': None,
            'wwMaxStates': None,
            'wwOption': None,
            'wwExpression': None,
            'wwUnit': None,
        },
        {
            'DateTime': '2025-02-06 12:00:01',
            'TagName': 'TagB',
            'Value': 67.89,
            'VValue': None,
            'Quality': 192,
            'QualityDetail': 0,
            'OpcQuality': None,
            'wwTagKey': 2,
            'wwRowCount': 1,
            'wwResolution': 1,
            'wwEdgeDetection': None,
            'wwRetrievalMode': 'Delta',
            'wwTimeDeadband': None,
            'wwValueDeadband': None,
            'wwTimeZone': None,
            'wwVersion': None,
            'wwCycleCount': None,
            'wwTimeStampRule': None,
            'wwInterpolationType': None,
            'wwQualityRule': None,
            'wwStateCalc': None,
            'StateTime': None,
            'PercentGood': None,
            'wwParameters': None,
            'StartDateTime': None,
            'SourceTag': None,
            'SourceServer': None,
            'wwFilter': None,
            'wwValueSelector': None,
            'wwMaxStates': None,
            'wwOption': None,
            'wwExpression': None,
            'wwUnit': None,
        }
    ]
