# Configuration Guide

This guide covers all configuration options for the Wonderware Historian connector.

## Environment Variables

The connector supports configuration via environment variables with a customizable prefix (default: `WONDERWARE_`).

### Connection Configuration

#### WONDERWARE_HOST (Required)

SQL Server hostname or IP address where Wonderware Historian is running.

```bash
export WONDERWARE_HOST=wonderware-server.example.com
# or
export WONDERWARE_HOST=192.168.1.100
```

#### WONDERWARE_PORT (Optional)

SQL Server port number. Default: `1433`

```bash
export WONDERWARE_PORT=1433
```

#### WONDERWARE_DATABASE (Optional)

Wonderware database name. Default: `Runtime`

```bash
export WONDERWARE_DATABASE=Runtime
```

Most Wonderware installations use the default "Runtime" database. Change this only if your installation uses a different name.

#### WONDERWARE_USERNAME (Optional)

SQL Server username for authentication. If not provided, uses Windows Authentication (if available).

```bash
export WONDERWARE_USERNAME=readonly_user
```

**Security Note**: For production, use a read-only user with minimal permissions (SELECT only on TagRef and History).

#### WONDERWARE_PASSWORD (Optional)

SQL Server password. Required if `WONDERWARE_USERNAME` is provided.

```bash
export WONDERWARE_PASSWORD=secure_password
```

**Security Note**: Never commit passwords to version control. Use environment variables or a secrets manager.

#### WONDERWARE_DRIVER (Optional)

SQLAlchemy driver to use for SQL Server connection. Default: `mssql+pytds`

```bash
export WONDERWARE_DRIVER=mssql+pytds  # Default, pure Python driver
# or
export WONDERWARE_DRIVER=mssql+pyodbc  # Requires ODBC driver
```

**Supported Drivers:**
- `mssql+pytds` - Pure Python driver (recommended, no dependencies)
- `mssql+pyodbc` - ODBC driver (requires SQL Server ODBC driver installed)
- `mssql+pymssql` - Alternative pure Python driver

## Configuration Object

You can also configure the connector programmatically using the `WonderwareConfig` class.

### Basic Configuration

```python
from wonderware import WonderwareConfig, WonderwareConnector

# Create configuration object
config = WonderwareConfig(
    host="wonderware-server.example.com",
    port=1433,
    database="Runtime",
    username="readonly_user",
    password="secure_password",
    driver="mssql+pytds"
)

# Build connector with config
connector = WonderwareConnector.build_from_config(config)
```

### Load from Environment

```python
from wonderware import WonderwareConfig, WonderwareConnector

# Load from environment with default prefix "WONDERWARE_"
config = WonderwareConfig.from_env()

# Load from environment with custom prefix
config = WonderwareConfig.from_env(prefix="CUSTOM_")

# Build connector
connector = WonderwareConnector.build_from_config(config)
```

### Connection String

The connector generates SQLAlchemy connection strings automatically. You can inspect the generated string:

```python
from wonderware import WonderwareConfig

config = WonderwareConfig(
    host="localhost",
    port=1433,
    database="Runtime",
    username="user",
    password="pass"
)

print(config.get_connection_string())
# Output: mssql+pytds://user:pass@localhost:1433/Runtime
```

## Advanced Configuration

### Connection Pool Settings

The connector uses SQLAlchemy's connection pooling. For advanced tuning, modify the `ConnectionPool` class:

```python
from wonderware import WonderwareConfig, WonderwareConnector
from wonderware.connection_manager import ConnectionPool, CircuitBreaker

config = WonderwareConfig.from_env()

# Custom circuit breaker settings
circuit_breaker = CircuitBreaker(
    failure_threshold=3,  # Open after 3 failures (default: 5)
    timeout_seconds=30    # Retry after 30 seconds (default: 60)
)

# Create custom connection pool
pool = ConnectionPool(config, circuit_breaker=circuit_breaker)

# Build connector with custom pool
connector = WonderwareConnector(config, connection_pool=pool)
```

### Retry Configuration

The connector uses `tenacity` for automatic retry with exponential backoff. Default settings:
- **Max attempts**: 3
- **Min wait**: 1 second
- **Max wait**: 10 seconds
- **Multiplier**: 1 (exponential backoff)

These are configured in `connection_manager.py` and can be modified if needed.

### Custom Driver Configuration

#### Using ODBC Driver

If you prefer ODBC:

```bash
# Install pyodbc
pip install pyodbc

# Configure environment
export WONDERWARE_DRIVER=mssql+pyodbc
export WONDERWARE_ODBC_DRIVER="ODBC Driver 17 for SQL Server"
```

Then modify the connection string generation to include the ODBC driver parameter.

#### Using Windows Authentication

For Windows Authentication (when running on Windows):

```python
from wonderware import WonderwareConfig

# No username/password - uses Windows auth
config = WonderwareConfig(
    host="localhost",
    port=1433,
    database="Runtime",
    driver="mssql+pyodbc"  # ODBC supports Windows auth
)

# Connection string: mssql+pyodbc://localhost:1433/Runtime
```

## Security Best Practices

### 1. Use Read-Only Credentials

Create a dedicated SQL Server user with minimal permissions:

```sql
-- Create read-only user
CREATE LOGIN wonderware_readonly WITH PASSWORD = 'secure_password';
USE Runtime;
CREATE USER wonderware_readonly FOR LOGIN wonderware_readonly;

-- Grant SELECT only on required tables
GRANT SELECT ON TagRef TO wonderware_readonly;
GRANT SELECT ON History TO wonderware_readonly;
```

### 2. Store Credentials Securely

Never hardcode credentials. Use one of these methods:

**Environment Variables:**
```bash
export WONDERWARE_USERNAME=readonly_user
export WONDERWARE_PASSWORD=secure_password
```

**Secrets Manager (AWS):**
```python
import boto3
import json
from wonderware import WonderwareConfig, WonderwareConnector

def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response['SecretString'])

secrets = get_secret('wonderware/credentials')
config = WonderwareConfig(
    host=secrets['host'],
    username=secrets['username'],
    password=secrets['password']
)
connector = WonderwareConnector.build_from_config(config)
```

**HashiCorp Vault:**
```python
import hvac
from wonderware import WonderwareConfig, WonderwareConnector

client = hvac.Client(url='http://localhost:8200')
client.token = 'your-token'
secrets = client.secrets.kv.v2.read_secret_version(path='wonderware')

config = WonderwareConfig(
    host=secrets['data']['data']['host'],
    username=secrets['data']['data']['username'],
    password=secrets['data']['data']['password']
)
connector = WonderwareConnector.build_from_config(config)
```

### 3. Use SSL/TLS Encryption

For production deployments, enable encrypted connections:

```python
from wonderware import WonderwareConfig

config = WonderwareConfig(
    host="wonderware-server.example.com",
    port=1433,
    database="Runtime",
    username="user",
    password="pass",
    driver="mssql+pyodbc"
)

# Add SSL parameters to connection string
# (Implementation depends on driver - modify connection_manager.py)
```

### 4. Network Security

- Use firewalls to restrict SQL Server access
- Use VPNs or private networks for remote access
- Enable SQL Server authentication logging
- Monitor for unusual query patterns

## Configuration Examples

### Development Environment

```bash
# .env.development
export WONDERWARE_HOST=localhost
export WONDERWARE_PORT=1433
export WONDERWARE_DATABASE=Runtime
export WONDERWARE_USERNAME=dev_user
export WONDERWARE_PASSWORD=dev_password
export WONDERWARE_DRIVER=mssql+pytds
```

### Production Environment

```bash
# .env.production
export WONDERWARE_HOST=wonderware-prod.internal.example.com
export WONDERWARE_PORT=1433
export WONDERWARE_DATABASE=Runtime
export WONDERWARE_USERNAME=prod_readonly
# Password loaded from secrets manager
export WONDERWARE_DRIVER=mssql+pytds
```

### Testing Environment

```python
# tests/conftest.py
import pytest
from wonderware import WonderwareConfig

@pytest.fixture
def test_config():
    """Test configuration with mock database."""
    return WonderwareConfig(
        host="localhost",
        port=1433,
        database="TestRuntime",
        username="test_user",
        password="test_password",
        driver="mssql+pytds"
    )
```

## Troubleshooting Configuration

### Connection Refused

**Symptom**: Cannot connect to SQL Server

**Solutions:**
1. Verify SQL Server is running: `telnet <host> <port>`
2. Check firewall rules allow port 1433
3. Verify SQL Server accepts remote connections
4. Check SQL Server Browser service is running

### Authentication Failed

**Symptom**: Login failed for user

**Solutions:**
1. Verify username and password are correct
2. Check SQL Server authentication mode (Windows vs Mixed)
3. Ensure user exists in SQL Server
4. Verify user has access to the specified database

### Database Not Found

**Symptom**: Cannot open database "Runtime"

**Solutions:**
1. Verify database name is correct
2. Check user has permissions to access the database
3. Confirm Wonderware database is actually named "Runtime"

### Driver Not Found

**Symptom**: No module named 'pytds' or 'pyodbc'

**Solutions:**
```bash
# For pytds
pip install python-tds

# For pyodbc
pip install pyodbc
# Also install ODBC driver for SQL Server
```

## Configuration Validation

Validate your configuration before use:

```python
from wonderware import WonderwareConnector

# Build connector
connector = WonderwareConnector.build_from_env()

# Test connection
if connector.test_connection():
    print("✓ Configuration is valid")
    status = connector.get_status()
    print(f"  Host: {status.host}")
    print(f"  Database: {status.database}")
    print(f"  Tags: {status.tag_count}")
else:
    print("✗ Configuration is invalid")
    print("  Check connection settings")

connector.close()
```

## Next Steps

- [Getting Started Guide](getting-started.md) - Complete tutorial
- [API Reference](api-reference.md) - Full API documentation
