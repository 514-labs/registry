"""Tests for SAP HANA CDC configuration."""

import os
import pytest
from unittest.mock import patch

from sap_hana_cdc.config import SAPHanaCDCConfig


class TestSAPHanaCDCConfig:
    """Test suite for SAPHanaCDCConfig."""

    def test_config_initialization(self) -> None:
        """Test basic config initialization."""
        config = SAPHanaCDCConfig(
            host="localhost",
            port=30015,
            user="admin",
            password="secret",
            client_id="client1",
            tables=["TABLE1", "TABLE2"],
            source_schema="SOURCE",
            cdc_schema="CDC",
        )

        assert config.host == "localhost"
        assert config.port == 30015
        assert config.user == "admin"
        assert config.password == "secret"
        assert config.client_id == "client1"
        assert config.tables == ["TABLE1", "TABLE2"]
        assert config.source_schema == "SOURCE"
        assert config.cdc_schema == "CDC"

    def test_config_default_values(self) -> None:
        """Test config with default values."""
        config = SAPHanaCDCConfig(host="localhost")

        assert config.host == "localhost"
        assert config.port == 30015
        assert config.user == "SYSTEM"
        assert config.password == ""
        assert config.client_id == "default_client"
        assert config.tables == []
        assert config.source_schema == "SAPHANADB"
        assert config.cdc_schema == "SAPHANADB"

    def test_config_tables_trimming(self) -> None:
        """Test that table names are trimmed and empty values removed."""
        config = SAPHanaCDCConfig(
            host="localhost",
            tables=["  TABLE1  ", "TABLE2", "  ", "", "TABLE3  "],
        )

        assert config.tables == ["TABLE1", "TABLE2", "TABLE3"]

    def test_config_from_env(self) -> None:
        """Test config creation from environment variables."""
        env_vars = {
            "SAP_HANA_HOST": "env-host",
            "SAP_HANA_PORT": "30013",
            "SAP_HANA_USERNAME": "envuser",
            "SAP_HANA_PASSWORD": "envpass",
            "SAP_HANA_CLIENT_ID": "env_client",
            "SAP_HANA_TABLES": "TABLE1,TABLE2,TABLE3",
            "SAP_HANA_SOURCE_SCHEMA": "ENV_SOURCE",
            "SAP_HANA_CDC_SCHEMA": "ENV_CDC",
        }

        with patch.dict(os.environ, env_vars, clear=False):
            config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")

        assert config.host == "env-host"
        assert config.port == 30013
        assert config.user == "envuser"
        assert config.password == "envpass"
        assert config.client_id == "env_client"
        assert config.tables == ["TABLE1", "TABLE2", "TABLE3"]
        assert config.source_schema == "ENV_SOURCE"
        assert config.cdc_schema == "ENV_CDC"

    def test_config_from_env_with_defaults(self) -> None:
        """Test config from env with missing variables uses defaults."""
        env_vars = {
            "SAP_HANA_HOST": "env-host",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")

        assert config.host == "env-host"
        assert config.port == 30015
        assert config.user == "SYSTEM"
        assert config.password == ""
        assert config.client_id == "default_client"
        assert config.tables == []
        assert config.source_schema == "SAPHANADB"
        assert config.cdc_schema == "SAPHANADB"

    def test_config_from_env_custom_prefix(self) -> None:
        """Test config from env with custom prefix."""
        env_vars = {
            "CUSTOM_HOST": "custom-host",
            "CUSTOM_PORT": "30016",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            config = SAPHanaCDCConfig.from_env(prefix="CUSTOM_")

        assert config.host == "custom-host"
        assert config.port == 30016

    def test_config_str_representation(self) -> None:
        """Test string representation of config."""
        config = SAPHanaCDCConfig(
            host="localhost",
            password="secret123",
        )

        config_str = str(config)

        assert "localhost" in config_str
        assert "secret123" not in config_str
        assert "***" in config_str

    def test_config_with_whitespace_in_tables(self) -> None:
        """Test that whitespace in table names is handled correctly."""
        config = SAPHanaCDCConfig(
            host="localhost",
            tables=["  TABLE1  ", "  TABLE2", "TABLE3  ", "   "],
        )

        assert "TABLE1" in config.tables
        assert "TABLE2" in config.tables
        assert "TABLE3" in config.tables
        assert len(config.tables) == 3

    def test_config_from_env_invalid_port(self) -> None:
        """Test config from env with invalid port raises error."""
        env_vars = {
            "SAP_HANA_HOST": "test-host",
            "SAP_HANA_PORT": "not_a_number",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            with pytest.raises(ValueError):
                SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")

    def test_config_empty_host(self) -> None:
        """Test that config requires a host."""
        with pytest.raises(TypeError):
            SAPHanaCDCConfig()

    def test_config_negative_port(self) -> None:
        """Test config with negative port."""
        config = SAPHanaCDCConfig(
            host="localhost",
            port=-1,
        )

        assert config.port == -1

    def test_config_empty_tables_list(self) -> None:
        """Test config with empty tables list after trimming."""
        config = SAPHanaCDCConfig(
            host="localhost",
            tables=["   ", "", "  "],
        )

        assert config.tables == []
        assert len(config.tables) == 0
