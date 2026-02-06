# API Reference

Complete API documentation for the Wonderware Historian connector.

## Table of Contents

- [WonderwareConnector](#wonderwareconnector)
- [WonderwareConfig](#wonderwareconfig)
- [WonderwareReader](#wonderwarereader)
- [ConnectionPool](#connectionpool)
- [Models](#models)
- [Exceptions](#exceptions)

---

## WonderwareConnector

High-level facade providing simple access to Wonderware Historian data.

### Class: `WonderwareConnector`

```python
class WonderwareConnector:
    def __init__(
        self,
        config: WonderwareConfig,
        connection_pool: Optional[ConnectionPool] = None
    )
```

**Parameters:**
- `config` (WonderwareConfig): Configuration object
- `connection_pool` (ConnectionPool, optional): Custom connection pool. If not provided, creates a new one.

### Static Methods

#### `build_from_env`

```python
@staticmethod
def build_from_env(prefix: str = "WONDERWARE_") -> WonderwareConnector
```

Build connector from environment variables.

**Parameters:**
- `prefix` (str): Environment variable prefix. Default: `"WONDERWARE_"`

**Returns:**
- `WonderwareConnector`: Configured connector instance

**Raises:**
- `ValueError`: If required environment variables are missing

**Example:**
```python
from wonderware import WonderwareConnector

# Using default prefix "WONDERWARE_"
connector = WonderwareConnector.build_from_env()

# Using custom prefix
connector = WonderwareConnector.build_from_env(prefix="CUSTOM_")
```

#### `build_from_config`

```python
@staticmethod
def build_from_config(config: WonderwareConfig) -> WonderwareConnector
```

Build connector from configuration object.

**Parameters:**
- `config` (WonderwareConfig): Configuration object

**Returns:**
- `WonderwareConnector`: Configured connector instance

**Example:**
```python
from wonderware import WonderwareConnector, WonderwareConfig

config = WonderwareConfig(
    host="localhost",
    port=1433,
    database="Runtime"
)
connector = WonderwareConnector.build_from_config(config)
```

### Instance Methods

#### `discover_tags`

```python
def discover_tags(self) -> List[str]
```

Discover all active tags from Wonderware TagRef table.

**Returns:**
- `List[str]`: List of tag names (excludes System tags starting with 'Sys')

**Raises:**
- `Exception`: If query fails

**Example:**
```python
tags = connector.discover_tags()
print(f"Found {len(tags)} tags")
for tag in tags[:10]:
    print(f"  - {tag}")
```

#### `fetch_history_data`

```python
def fetch_history_data(
    self,
    tag_names: List[str],
    date_from: str,
    date_to: str,
    inclusive_start: bool = True
) -> List[Dict]
```

Fetch historical data from Wonderware History view.

**Parameters:**
- `tag_names` (List[str]): List of tag names to query
- `date_from` (str): Start datetime in ISO format (e.g., "2026-01-01T00:00:00")
- `date_to` (str): End datetime in ISO format
- `inclusive_start` (bool): If True, uses BETWEEN (>=). If False, uses > (exclusive start). Default: True

**Returns:**
- `List[Dict]`: List of row dictionaries with all 33 history fields

**Raises:**
- `Exception`: If query fails

**Fields in returned dictionaries:**
- `DateTime` (datetime): Timestamp
- `TagName` (str): Tag name
- `Value` (float): Numeric value
- `VValue` (str): String value
- `Quality` (int): Quality code (192 = good)
- `QualityDetail` (str): Quality details
- `OpcQuality` (int): OPC quality code
- `wwTagKey` (int): Internal tag key
- `wwRowCount` (int): Row count
- `wwResolution` (int): Resolution
- `wwEdgeDetection` (int): Edge detection setting
- `wwRetrievalMode` (str): Retrieval mode (typically "Delta")
- ... (see HistoryRow model for complete list)

**Example:**
```python
rows = connector.fetch_history_data(
    tag_names=["Temperature_01", "Pressure_02"],
    date_from="2026-01-01T00:00:00",
    date_to="2026-01-02T00:00:00",
    inclusive_start=True
)

for row in rows:
    print(f"{row['DateTime']} | {row['TagName']}: {row['Value']}")
```

**Note on `inclusive_start`:**
- Use `True` for initial backfills (includes start time)
- Use `False` for incremental syncs (excludes start time to avoid duplicates)

#### `get_tag_count`

```python
def get_tag_count(self) -> int
```

Get count of active tags.

**Returns:**
- `int`: Number of active tags (excluding System tags)

**Raises:**
- `Exception`: If query fails

**Example:**
```python
count = connector.get_tag_count()
print(f"Total active tags: {count}")
```

#### `test_connection`

```python
def test_connection(self) -> bool
```

Test if connection to Wonderware is working.

**Returns:**
- `bool`: True if connection is valid, False otherwise

**Example:**
```python
if connector.test_connection():
    print("Connection OK")
else:
    print("Connection failed")
```

#### `get_status`

```python
def get_status(self) -> ConnectorStatus
```

Get current connector status.

**Returns:**
- `ConnectorStatus`: Status object with connection info and metrics

**Example:**
```python
status = connector.get_status()
print(f"Connected: {status.connected}")
print(f"Host: {status.host}")
print(f"Database: {status.database}")
print(f"Tag Count: {status.tag_count}")
print(f"Last Check: {status.last_check}")
if status.error:
    print(f"Error: {status.error}")
```

#### `refresh_connection`

```python
def refresh_connection(self) -> None
```

Refresh the database connection.

Useful after connection errors or to reset the connection pool.

**Example:**
```python
try:
    rows = connector.fetch_history_data(...)
except Exception as e:
    print(f"Error: {e}")
    connector.refresh_connection()
    # Retry...
```

#### `close`

```python
def close(self) -> None
```

Close all connections and cleanup resources.

Always call this when done with the connector, or use the context manager protocol.

**Example:**
```python
connector = WonderwareConnector.build_from_env()
try:
    # Use connector
    pass
finally:
    connector.close()
```

### Context Manager Protocol

The connector supports the context manager protocol for automatic cleanup.

**Example:**
```python
with WonderwareConnector.build_from_env() as connector:
    tags = connector.discover_tags()
    rows = connector.fetch_history_data(...)
# Connection automatically closed
```

---

## WonderwareConfig

Configuration dataclass for Wonderware connection settings.

### Class: `WonderwareConfig`

```python
@dataclass
class WonderwareConfig:
    host: str
    port: int = 1433
    database: str = "Runtime"
    username: Optional[str] = None
    password: Optional[str] = None
    driver: str = "mssql+pytds"
```

**Fields:**
- `host` (str, required): SQL Server hostname or IP address
- `port` (int): SQL Server port. Default: 1433
- `database` (str): Database name. Default: "Runtime"
- `username` (str, optional): SQL Server username
- `password` (str, optional): SQL Server password
- `driver` (str): SQLAlchemy driver. Default: "mssql+pytds"

### Static Methods

#### `from_env`

```python
@staticmethod
def from_env(prefix: str = "WONDERWARE_") -> WonderwareConfig
```

Load configuration from environment variables.

**Parameters:**
- `prefix` (str): Environment variable prefix. Default: `"WONDERWARE_"`

**Environment Variables:**
- `{prefix}HOST` (required): SQL Server host
- `{prefix}PORT`: SQL Server port (default: 1433)
- `{prefix}DATABASE`: Database name (default: "Runtime")
- `{prefix}USERNAME`: SQL Server username
- `{prefix}PASSWORD`: SQL Server password
- `{prefix}DRIVER`: SQLAlchemy driver (default: "mssql+pytds")

**Returns:**
- `WonderwareConfig`: Configuration object

**Raises:**
- `ValueError`: If required `{prefix}HOST` is not set

**Example:**
```python
import os
from wonderware import WonderwareConfig

os.environ['WONDERWARE_HOST'] = 'localhost'
os.environ['WONDERWARE_PORT'] = '1433'

config = WonderwareConfig.from_env()
print(config.host)  # 'localhost'
print(config.port)  # 1433
```

### Instance Methods

#### `get_connection_string`

```python
def get_connection_string(self) -> str
```

Build SQLAlchemy connection string.

**Returns:**
- `str`: Connection string for SQLAlchemy

**Example:**
```python
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

---

## WonderwareReader

Low-level data extraction class for querying Wonderware SQL Server.

### Class: `WonderwareReader`

```python
class WonderwareReader:
    def __init__(self, engine: Engine)
```

**Parameters:**
- `engine` (sqlalchemy.engine.Engine): SQLAlchemy engine instance

**Note**: Typically used internally by `WonderwareConnector`. Direct usage is rare.

### Instance Methods

#### `discover_tags`

```python
def discover_tags(self) -> List[str]
```

Discover all active tags from TagRef table.

See [WonderwareConnector.discover_tags](#discover_tags) for details.

#### `fetch_history_data`

```python
def fetch_history_data(
    self,
    tag_names: List[str],
    date_from: str,
    date_to: str,
    inclusive_start: bool = True
) -> List[Dict]
```

Fetch historical data from History view.

See [WonderwareConnector.fetch_history_data](#fetch_history_data) for details.

#### `get_tag_count`

```python
def get_tag_count(self) -> int
```

Get count of active tags.

See [WonderwareConnector.get_tag_count](#get_tag_count) for details.

#### `test_connection`

```python
def test_connection(self) -> bool
```

Test database connectivity.

See [WonderwareConnector.test_connection](#test_connection) for details.

---

## ConnectionPool

Connection pool with retry logic and circuit breaker pattern.

### Class: `ConnectionPool`

```python
class ConnectionPool:
    def __init__(
        self,
        config: WonderwareConfig,
        circuit_breaker: Optional[CircuitBreaker] = None
    )
```

**Parameters:**
- `config` (WonderwareConfig): Configuration object
- `circuit_breaker` (CircuitBreaker, optional): Custom circuit breaker. If not provided, creates a new one.

### Instance Methods

#### `get_engine`

```python
def get_engine(self) -> Engine
```

Get a database engine with circuit breaker protection.

**Returns:**
- `sqlalchemy.engine.Engine`: Active SQLAlchemy engine

**Raises:**
- `CircuitBreakerOpenError`: If circuit breaker is open
- `Exception`: If connection fails after retry attempts

#### `close`

```python
def close(self) -> None
```

Close the connection pool and cleanup resources.

### Context Manager Protocol

Supports context manager for automatic cleanup:

```python
with ConnectionPool(config) as pool:
    engine = pool.get_engine()
    # Use engine
# Pool automatically closed
```

---

## Models

### TagInfo

```python
@dataclass
class TagInfo:
    name: str
    tag_type: int
    tag_key: Optional[int] = None
```

Information about a Wonderware tag.

**Fields:**
- `name` (str): Tag name
- `tag_type` (int): Tag type identifier
- `tag_key` (int, optional): Internal tag key

### HistoryRow

```python
@dataclass
class HistoryRow:
    DateTime: datetime
    TagName: str
    Value: Optional[float]
    VValue: Optional[str]
    Quality: Optional[int]
    QualityDetail: Optional[str]
    OpcQuality: Optional[int]
    wwTagKey: Optional[int]
    wwRowCount: Optional[int]
    wwResolution: Optional[int]
    wwEdgeDetection: Optional[int]
    wwRetrievalMode: Optional[str]
    wwTimeDeadband: Optional[float]
    wwValueDeadband: Optional[float]
    wwTimeZone: Optional[str]
    wwVersion: Optional[str]
    wwCycleCount: Optional[int]
    wwTimeStampRule: Optional[str]
    wwInterpolationType: Optional[str]
    wwQualityRule: Optional[str]
    wwStateCalc: Optional[str]
    StateTime: Optional[float]
    PercentGood: Optional[float]
    wwParameters: Optional[str]
    StartDateTime: Optional[datetime]
    SourceTag: Optional[str]
    SourceServer: Optional[str]
    wwFilter: Optional[str]
    wwValueSelector: Optional[str]
    wwMaxStates: Optional[int]
    wwOption: Optional[str]
    wwExpression: Optional[str]
    wwUnit: Optional[str]
```

Historical data row from Wonderware History view (33 fields).

**Key Fields:**
- `DateTime`: Timestamp of the data point
- `TagName`: Name of the tag
- `Value`: Numeric value (for analog tags)
- `VValue`: String value (for digital tags)
- `Quality`: Quality code (192 = good quality)
- `wwRetrievalMode`: Typically "Delta" for raw data

### ConnectorStatus

```python
@dataclass
class ConnectorStatus:
    connected: bool
    host: str
    database: str
    tag_count: Optional[int]
    last_check: datetime
    error: Optional[str] = None
```

Status information for the Wonderware connector.

**Fields:**
- `connected` (bool): Connection status
- `host` (str): SQL Server hostname
- `database` (str): Database name
- `tag_count` (int, optional): Number of active tags
- `last_check` (datetime): Timestamp of last status check
- `error` (str, optional): Error message if connection failed

---

## Exceptions

### CircuitBreakerOpenError

```python
class CircuitBreakerOpenError(Exception):
    """Raised when circuit breaker is open and rejecting calls."""
```

Raised when the circuit breaker is open due to too many consecutive failures.

**Example:**
```python
from wonderware import WonderwareConnector
from wonderware.connection_manager import CircuitBreakerOpenError

connector = WonderwareConnector.build_from_env()

try:
    rows = connector.fetch_history_data(...)
except CircuitBreakerOpenError:
    print("Circuit breaker is open - waiting before retry")
    time.sleep(60)  # Wait for circuit breaker timeout
```

### SQLAlchemy Exceptions

The connector may also raise standard SQLAlchemy exceptions:

- `sqlalchemy.exc.OperationalError`: Database connection errors
- `sqlalchemy.exc.ProgrammingError`: SQL syntax or schema errors
- `sqlalchemy.exc.DatabaseError`: General database errors

**Example:**
```python
from sqlalchemy.exc import OperationalError
from wonderware import WonderwareConnector

connector = WonderwareConnector.build_from_env()

try:
    rows = connector.fetch_history_data(...)
except OperationalError as e:
    print(f"Database connection error: {e}")
```

---

## Type Hints

The connector uses Python type hints throughout for better IDE support and type checking.

**Example with type checking:**
```python
from typing import List, Dict
from wonderware import WonderwareConnector

def process_tags(connector: WonderwareConnector) -> List[Dict]:
    """Process tags with type hints."""
    tags: List[str] = connector.discover_tags()
    rows: List[Dict] = connector.fetch_history_data(
        tag_names=tags[:10],
        date_from="2026-01-01T00:00:00",
        date_to="2026-01-02T00:00:00"
    )
    return rows
```

---

## Advanced Usage

### Custom Circuit Breaker Configuration

```python
from wonderware import WonderwareConfig, WonderwareConnector
from wonderware.connection_manager import ConnectionPool, CircuitBreaker

config = WonderwareConfig.from_env()

# Custom circuit breaker settings
circuit_breaker = CircuitBreaker(
    failure_threshold=3,  # Open after 3 failures (default: 5)
    timeout_seconds=30    # Retry after 30 seconds (default: 60)
)

# Create custom pool
pool = ConnectionPool(config, circuit_breaker=circuit_breaker)

# Build connector with custom pool
connector = WonderwareConnector(config, connection_pool=pool)
```

### Direct Reader Usage

```python
from wonderware import WonderwareConfig
from wonderware.connection_manager import ConnectionPool
from wonderware.reader import WonderwareReader

config = WonderwareConfig.from_env()
pool = ConnectionPool(config)
engine = pool.get_engine()

# Use reader directly
reader = WonderwareReader(engine)
tags = reader.discover_tags()
rows = reader.fetch_history_data(
    tag_names=tags[:10],
    date_from="2026-01-01T00:00:00",
    date_to="2026-01-02T00:00:00"
)

pool.close()
```

---

## See Also

- [Configuration Guide](configuration.md) - Detailed configuration options
- [Getting Started Guide](getting-started.md) - Step-by-step tutorial
- [Main README](../README.md) - Overview and quick start
