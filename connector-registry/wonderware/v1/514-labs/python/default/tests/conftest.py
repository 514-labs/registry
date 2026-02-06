"""Test configuration and fixtures for Wonderware connector."""
import os
import pytest
from unittest.mock import Mock, MagicMock
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool


@pytest.fixture
def mock_env(monkeypatch):
    """Set up mock environment variables."""
    env_vars = {
        "WONDERWARE_HOST": "test-host",
        "WONDERWARE_PORT": "1433",
        "WONDERWARE_DATABASE": "TestDB",
        "WONDERWARE_USERNAME": "test_user",
        "WONDERWARE_PASSWORD": "test_pass",
        "WONDERWARE_DRIVER": "mssql+pytds",
    }
    for key, value in env_vars.items():
        monkeypatch.setenv(key, value)
    return env_vars


@pytest.fixture
def mock_engine():
    """Create a mock SQLAlchemy engine."""
    # Use in-memory SQLite for testing
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    # Create test tables
    with engine.begin() as conn:
        conn.execute(text('''
            CREATE TABLE TagRef (
                TagName TEXT,
                TagType INTEGER
            )
        '''))
        conn.execute(text('''
            CREATE TABLE History (
                DateTime TEXT,
                TagName TEXT,
                Value REAL,
                VValue TEXT,
                Quality INTEGER,
                QualityDetail TEXT,
                OpcQuality INTEGER,
                wwTagKey INTEGER,
                wwRowCount INTEGER,
                wwResolution INTEGER,
                wwEdgeDetection INTEGER,
                wwRetrievalMode TEXT,
                wwTimeDeadband REAL,
                wwValueDeadband REAL,
                wwTimeZone TEXT,
                wwVersion TEXT,
                wwCycleCount INTEGER,
                wwTimeStampRule TEXT,
                wwInterpolationType TEXT,
                wwQualityRule TEXT,
                wwStateCalc TEXT,
                StateTime REAL,
                PercentGood REAL,
                wwParameters TEXT,
                StartDateTime TEXT,
                SourceTag TEXT,
                SourceServer TEXT,
                wwFilter TEXT,
                wwValueSelector TEXT,
                wwMaxStates INTEGER,
                wwOption TEXT,
                wwExpression TEXT,
                wwUnit TEXT
            )
        '''))

        # Insert test data
        conn.execute(text('''
            INSERT INTO TagRef (TagName, TagType) VALUES
                ('Tag1', 1),
                ('Tag2', 1),
                ('SysTag', 1)
        '''))

        conn.execute(text('''
            INSERT INTO History (
                DateTime, TagName, Value, wwRetrievalMode
            ) VALUES
                ('2026-01-01 00:00:00', 'Tag1', 100.0, 'Delta'),
                ('2026-01-01 00:01:00', 'Tag1', 101.0, 'Delta'),
                ('2026-01-01 00:00:00', 'Tag2', 200.0, 'Delta')
        '''))

    yield engine
    engine.dispose()


@pytest.fixture
def wonderware_config():
    """Create a test WonderwareConfig."""
    from wonderware.config import WonderwareConfig

    return WonderwareConfig(
        host="test-host",
        port=1433,
        database="TestDB",
        username="test_user",
        password="test_pass",
        driver="mssql+pytds"
    )
