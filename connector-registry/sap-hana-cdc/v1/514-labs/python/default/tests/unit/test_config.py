"""Unit tests for SAP HANA CDC configuration."""
import os
import pytest
from sap_hana_cdc import SAPHanaCDCConfig


@pytest.mark.unit
class TestSAPHanaCDCConfig:
    """Test SAPHanaCDCConfig functionality."""

    def test_config_creation(self):
        """Test creating a config object with default values."""
        config = SAPHanaCDCConfig(
            host="localhost",
            user="SYSTEM",
            password="password",
        )
        assert config.host == "localhost"
        assert config.port == 30015  # Default port
        assert config.user == "SYSTEM"
        assert config.password == "password"
        assert config.client_id == "default_client"
        assert config.tables == []
        assert config.source_schema == "SAPHANADB"
        assert config.cdc_schema == "SAPHANADB"

    def test_config_with_custom_values(self):
        """Test creating a config with custom values."""
        config = SAPHanaCDCConfig(
            host="sapserver.example.com",
            port=39015,
            user="CDCUSER",
            password="secret",
            client_id="client_123",
            tables=["TABLE1", "TABLE2", "TABLE3"],
            source_schema="SOURCE_SCHEMA",
            cdc_schema="CDC_SCHEMA",
        )
        assert config.host == "sapserver.example.com"
        assert config.port == 39015
        assert config.user == "CDCUSER"
        assert config.client_id == "client_123"
        assert config.tables == ["TABLE1", "TABLE2", "TABLE3"]
        assert config.source_schema == "SOURCE_SCHEMA"
        assert config.cdc_schema == "CDC_SCHEMA"

    def test_config_from_env(self, monkeypatch):
        """Test creating config from environment variables."""
        monkeypatch.setenv("SAP_HANA_HOST", "envhost")
        monkeypatch.setenv("SAP_HANA_PORT", "39015")
        monkeypatch.setenv("SAP_HANA_USERNAME", "ENVUSER")
        monkeypatch.setenv("SAP_HANA_PASSWORD", "envpass")
        monkeypatch.setenv("SAP_HANA_CLIENT_ID", "env_client")
        monkeypatch.setenv("SAP_HANA_TABLES", "EKKO,EKPO,MARA")
        monkeypatch.setenv("SAP_HANA_SOURCE_SCHEMA", "ENVSOURCE")
        monkeypatch.setenv("SAP_HANA_CDC_SCHEMA", "ENVCDC")

        config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
        assert config.host == "envhost"
        assert config.port == 39015
        assert config.user == "ENVUSER"
        assert config.password == "envpass"
        assert config.client_id == "env_client"
        assert config.tables == ["EKKO", "EKPO", "MARA"]
        assert config.source_schema == "ENVSOURCE"
        assert config.cdc_schema == "ENVCDC"

    def test_config_from_env_with_defaults(self, monkeypatch):
        """Test from_env falls back to defaults when env vars not set."""
        # Clear any existing env vars
        for key in [
            "SAP_HANA_HOST",
            "SAP_HANA_PORT",
            "SAP_HANA_USERNAME",
            "SAP_HANA_PASSWORD",
            "SAP_HANA_CLIENT_ID",
            "SAP_HANA_TABLES",
            "SAP_HANA_SOURCE_SCHEMA",
            "SAP_HANA_CDC_SCHEMA",
        ]:
            monkeypatch.delenv(key, raising=False)

        config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
        assert config.host == "localhost"
        assert config.port == 30015
        assert config.user == "SYSTEM"
        assert config.password == ""
        assert config.client_id == "default_client"
        assert config.tables == [""]  # Empty string from split
        assert config.source_schema == "SAPHANADB"
        assert config.cdc_schema == "SAPHANADB"

    def test_config_tables_trim_whitespace(self):
        """Test that table names are trimmed of whitespace."""
        config = SAPHanaCDCConfig(
            host="localhost",
            user="SYSTEM",
            password="password",
            tables=["  TABLE1  ", "TABLE2", "  TABLE3"],
        )
        assert config.tables == ["TABLE1", "TABLE2", "TABLE3"]

    def test_config_tables_remove_empty(self):
        """Test that empty table names are removed."""
        config = SAPHanaCDCConfig(
            host="localhost",
            user="SYSTEM",
            password="password",
            tables=["TABLE1", "", "  ", "TABLE2"],
        )
        assert config.tables == ["TABLE1", "TABLE2"]

    def test_config_str_hides_password(self):
        """Test that __str__ hides the password."""
        config = SAPHanaCDCConfig(
            host="localhost",
            user="SYSTEM",
            password="secret_password",
        )
        config_str = str(config)
        assert "secret_password" not in config_str
        assert "password='***'" in config_str
        assert "localhost" in config_str
        assert "SYSTEM" in config_str

    def test_config_port_validation_from_string(self, monkeypatch):
        """Test that port is properly converted from string."""
        monkeypatch.setenv("SAP_HANA_HOST", "localhost")
        monkeypatch.setenv("SAP_HANA_PORT", "39015")

        config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
        assert isinstance(config.port, int)
        assert config.port == 39015

    def test_config_tables_from_csv_string(self, monkeypatch):
        """Test parsing comma-separated table list from env."""
        monkeypatch.setenv("SAP_HANA_TABLES", "TABLE1,TABLE2,TABLE3")

        config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
        assert config.tables == ["TABLE1", "TABLE2", "TABLE3"]

    def test_config_tables_from_csv_with_spaces(self, monkeypatch):
        """Test parsing CSV with spaces is handled correctly."""
        monkeypatch.setenv("SAP_HANA_TABLES", " TABLE1 , TABLE2 , TABLE3 ")

        config = SAPHanaCDCConfig.from_env(prefix="SAP_HANA_")
        assert config.tables == ["TABLE1", "TABLE2", "TABLE3"]
