"""Tests for WonderwareConfig."""
import pytest
import os


def test_config_from_env(mock_env):
    """Test loading config from environment variables."""
    from wonderware.config import WonderwareConfig

    config = WonderwareConfig.from_env()

    assert config.host == "test-host"
    assert config.port == 1433
    assert config.database == "TestDB"
    assert config.username == "test_user"
    assert config.password == "test_pass"
    assert config.driver == "mssql+pytds"


def test_config_from_env_missing_host(monkeypatch):
    """Test that missing host raises ValueError."""
    from wonderware.config import WonderwareConfig

    # Clear the host env var
    monkeypatch.delenv("WONDERWARE_HOST", raising=False)

    with pytest.raises(ValueError, match="WONDERWARE_HOST environment variable is required"):
        WonderwareConfig.from_env()


def test_config_from_env_defaults(monkeypatch):
    """Test that defaults are used when optional vars are missing."""
    from wonderware.config import WonderwareConfig

    # Only set required host
    monkeypatch.setenv("WONDERWARE_HOST", "test-host")
    for key in ["WONDERWARE_PORT", "WONDERWARE_DATABASE", "WONDERWARE_USERNAME",
                "WONDERWARE_PASSWORD", "WONDERWARE_DRIVER"]:
        monkeypatch.delenv(key, raising=False)

    config = WonderwareConfig.from_env()

    assert config.host == "test-host"
    assert config.port == 1433  # default
    assert config.database == "Runtime"  # default
    assert config.username is None  # default
    assert config.password is None  # default
    assert config.driver == "mssql+pytds"  # default


def test_get_connection_string_with_auth(wonderware_config):
    """Test connection string generation with authentication."""
    conn_str = wonderware_config.get_connection_string()

    assert conn_str == "mssql+pytds://test_user:test_pass@test-host:1433/TestDB"


def test_get_connection_string_without_auth():
    """Test connection string generation without authentication."""
    from wonderware.config import WonderwareConfig

    config = WonderwareConfig(
        host="test-host",
        port=1433,
        database="TestDB",
        username=None,
        password=None,
        driver="mssql+pytds"
    )

    conn_str = config.get_connection_string()

    assert conn_str == "mssql+pytds://test-host:1433/TestDB"


def test_config_custom_prefix(monkeypatch):
    """Test loading config with custom prefix."""
    from wonderware.config import WonderwareConfig

    monkeypatch.setenv("CUSTOM_HOST", "custom-host")
    monkeypatch.setenv("CUSTOM_PORT", "5000")

    config = WonderwareConfig.from_env(prefix="CUSTOM_")

    assert config.host == "custom-host"
    assert config.port == 5000
