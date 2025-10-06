import pytest
from unittest.mock import Mock, patch
from sap_hana_cdc import Client, CDCConfig, SAPHanaConfig, ChangeType

class TestClient:
    """Test cases for SAP HANA CDC Client."""
    
    def test_client_initialization(self):
        """Test client initialization with valid config."""
        config = {
            "sap_hana": {
                "host": "test-host",
                "port": 30015,
                "user": "test-user",
                "password": "test-password",
                "schema": "TEST_SCHEMA"
            },
            "cdc": {
                "tables": ["TEST_TABLE"],
                "change_types": ["INSERT", "UPDATE", "DELETE"],
                "change_table_name": "cdc_changes"
            }
        }
        
        client = Client(config)
        assert client.config == config
        assert client.sap_config.host == "test-host"
        assert client.sap_config.port == 30015
        assert client.cdc_config.tables == ["TEST_TABLE"]
    
    def test_config_validation(self):
        """Test configuration validation."""
        # Test missing required fields
        with pytest.raises(ValueError):
            Client({})
        
        # Test invalid change types
        config = {
            "sap_hana": {
                "host": "test-host",
                "port": 30015,
                "user": "test-user",
                "password": "test-password",
                "schema": "TEST_SCHEMA"
            },
            "cdc": {
                "tables": ["TEST_TABLE"],
                "change_types": ["INVALID_TYPE"]
            }
        }
        
        with pytest.raises(ValueError):
            Client(config)
    
    @patch('sap_hana_cdc.dbapi.connect')
    def test_connect(self, mock_connect):
        """Test database connection."""
        mock_connection = Mock()
        mock_connect.return_value = mock_connection
        
        config = {
            "sap_hana": {
                "host": "test-host",
                "port": 30015,
                "user": "test-user",
                "password": "test-password",
                "schema": "TEST_SCHEMA"
            },
            "cdc": {
                "tables": ["TEST_TABLE"],
                "change_types": ["INSERT"]
            }
        }
        
        client = Client(config)
        client.connect()
        
        mock_connect.assert_called_once_with(
            address="test-host",
            port=30015,
            user="test-user",
            password="test-password",
            autocommit=True
        )
        assert client.connection == mock_connection
        assert client.is_connected is True
    
    def test_disconnect(self):
        """Test database disconnection."""
        config = {
            "sap_hana": {
                "host": "test-host",
                "port": 30015,
                "user": "test-user",
                "password": "test-password",
                "schema": "TEST_SCHEMA"
            },
            "cdc": {
                "tables": ["TEST_TABLE"],
                "change_types": ["INSERT"]
            }
        }
        
        client = Client(config)
        client.connection = Mock()
        client.is_connected = True
        
        client.disconnect()
        
        client.connection.close.assert_called_once()
        assert client.connection is None
        assert client.is_connected is False
    
    @patch('sap_hana_cdc.dbapi.connect')
    def test_get_changes_not_connected(self, mock_connect):
        """Test get_changes when not connected."""
        config = {
            "sap_hana": {
                "host": "test-host",
                "port": 30015,
                "user": "test-user",
                "password": "test-password",
                "schema": "TEST_SCHEMA"
            },
            "cdc": {
                "tables": ["TEST_TABLE"],
                "change_types": ["INSERT"]
            }
        }
        
        client = Client(config)
        
        with pytest.raises(RuntimeError, match="Not connected to database"):
            client.get_changes()
    
    @patch('sap_hana_cdc.dbapi.connect')
    def test_get_changes_connected(self, mock_connect):
        """Test get_changes when connected."""
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor
        mock_cursor.fetchall.return_value = []
        mock_connect.return_value = mock_connection
        
        config = {
            "sap_hana": {
                "host": "test-host",
                "port": 30015,
                "user": "test-user",
                "password": "test-password",
                "schema": "TEST_SCHEMA"
            },
            "cdc": {
                "tables": ["TEST_TABLE"],
                "change_types": ["INSERT"],
                "change_table_name": "cdc_changes"
            }
        }
        
        client = Client(config)
        client.connect()
        
        changes = client.get_changes()
        
        assert changes.changes == []
        mock_cursor.execute.assert_called_once()
        mock_cursor.fetchall.assert_called_once()

if __name__ == "__main__":
    pytest.main([__file__])
