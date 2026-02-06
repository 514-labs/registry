# Getting Started with Wonderware Historian Connector

This guide will walk you through installing and using the Wonderware Historian connector to extract historical data from your AVEVA Wonderware system.

## Prerequisites

Before you begin, ensure you have:

- **Python 3.8 or higher** installed
- **Access to Wonderware Historian** SQL Server database
- **Network connectivity** to the Wonderware SQL Server (port 1433)
- **Database credentials** with at least SELECT permissions on TagRef and History tables

## Step 1: Installation

### Option A: Install from Registry (Recommended)

```bash
# Install connector
bash -i <(curl https://registry.514.ai/install.sh) wonderware v1 514-labs python default

# Navigate to connector directory
cd wonderware

# Install dependencies
pip install -r requirements.txt
```

### Option B: Install Dependencies Only

If you're bundling into an existing project:

```bash
pip install sqlalchemy>=2.0.0 python-tds>=1.15.0 tenacity>=8.0.0
```

## Step 2: Configure Environment

Set up your environment variables with your Wonderware connection details:

```bash
# Required: SQL Server host
export WONDERWARE_HOST=your-wonderware-server.example.com

# Optional: Override defaults
export WONDERWARE_PORT=1433
export WONDERWARE_DATABASE=Runtime
export WONDERWARE_USERNAME=your_username
export WONDERWARE_PASSWORD=your_password
```

**💡 Tip**: Create a `.env` file in your project directory:

```bash
# .env
WONDERWARE_HOST=wonderware-server.example.com
WONDERWARE_PORT=1433
WONDERWARE_DATABASE=Runtime
WONDERWARE_USERNAME=readonly_user
WONDERWARE_PASSWORD=secure_password
```

Then load it in your Python script:

```python
from dotenv import load_dotenv
load_dotenv()  # Load .env file

from wonderware import WonderwareConnector
connector = WonderwareConnector.build_from_env()
```

## Step 3: Test Connection

Create a simple test script to verify your connection:

```python
# test_connection.py
from wonderware import WonderwareConnector

# Build connector from environment
connector = WonderwareConnector.build_from_env()

# Test connection
if connector.test_connection():
    print("✓ Successfully connected to Wonderware!")

    # Get status
    status = connector.get_status()
    print(f"  Host: {status.host}")
    print(f"  Database: {status.database}")
    print(f"  Connected: {status.connected}")
    print(f"  Total tags: {status.tag_count}")
else:
    print("✗ Failed to connect to Wonderware")
    print("  Check your connection settings")

# Clean up
connector.close()
```

Run the test:

```bash
python test_connection.py
```

Expected output:
```
✓ Successfully connected to Wonderware!
  Host: wonderware-server.example.com
  Database: Runtime
  Connected: True
  Total tags: 1,234
```

## Step 4: Discover Tags

Now let's discover what tags are available in your Wonderware system:

```python
# discover_tags.py
from wonderware import WonderwareConnector

with WonderwareConnector.build_from_env() as connector:
    # Discover all tags
    tags = connector.discover_tags()

    print(f"Found {len(tags)} tags:")
    print("\nFirst 10 tags:")
    for i, tag in enumerate(tags[:10], 1):
        print(f"  {i}. {tag}")

    # Save to file for reference
    with open('wonderware_tags.txt', 'w') as f:
        f.write('\n'.join(tags))

    print(f"\n✓ All tags saved to wonderware_tags.txt")
```

Run the script:

```bash
python discover_tags.py
```

Expected output:
```
Found 1234 tags:

First 10 tags:
  1. Temperature_Reactor_01
  2. Pressure_Tank_02
  3. Flow_Rate_Line_A
  4. Level_Storage_Tank_01
  5. pH_Measurement_03
  6. Conductivity_Sensor_02
  7. Valve_Position_V123
  8. Motor_Speed_M456
  9. Pump_Status_P789
  10. Alarm_High_Temp_R01

✓ All tags saved to wonderware_tags.txt
```

## Step 5: Fetch Historical Data

Now let's fetch some historical data for specific tags:

```python
# fetch_history.py
from wonderware import WonderwareConnector
from datetime import datetime, timedelta
import json

with WonderwareConnector.build_from_env() as connector:
    # Define tags to fetch
    tags_to_fetch = [
        "Temperature_Reactor_01",
        "Pressure_Tank_02"
    ]

    # Define date range (last 24 hours)
    end_time = datetime.now()
    start_time = end_time - timedelta(days=1)

    print(f"Fetching data for {len(tags_to_fetch)} tags...")
    print(f"  From: {start_time}")
    print(f"  To: {end_time}")

    # Fetch historical data
    rows = connector.fetch_history_data(
        tag_names=tags_to_fetch,
        date_from=start_time.isoformat(),
        date_to=end_time.isoformat(),
        inclusive_start=True
    )

    print(f"\n✓ Retrieved {len(rows)} data points")

    # Display first few rows
    print("\nFirst 5 rows:")
    for row in rows[:5]:
        print(f"  {row['DateTime']} | {row['TagName']}: {row['Value']}")

    # Save to JSON
    with open('wonderware_data.json', 'w') as f:
        json.dump(rows, f, indent=2, default=str)

    print(f"\n✓ Data saved to wonderware_data.json")
```

Run the script:

```bash
python fetch_history.py
```

Expected output:
```
Fetching data for 2 tags...
  From: 2026-02-05 10:30:00
  To: 2026-02-06 10:30:00

✓ Retrieved 2,456 data points

First 5 rows:
  2026-02-05 10:30:00 | Temperature_Reactor_01: 72.5
  2026-02-05 10:30:30 | Temperature_Reactor_01: 72.6
  2026-02-05 10:31:00 | Temperature_Reactor_01: 72.4
  2026-02-05 10:30:00 | Pressure_Tank_02: 145.2
  2026-02-05 10:30:30 | Pressure_Tank_02: 145.3

✓ Data saved to wonderware_data.json
```

## Step 6: Process Data in Batches

For large datasets, process tags in batches:

```python
# batch_processing.py
from wonderware import WonderwareConnector
from datetime import datetime, timedelta

with WonderwareConnector.build_from_env() as connector:
    # Get all tags
    all_tags = connector.discover_tags()
    print(f"Processing {len(all_tags)} tags in batches...")

    # Configuration
    batch_size = 10
    start_time = (datetime.now() - timedelta(days=1)).isoformat()
    end_time = datetime.now().isoformat()

    total_rows = 0

    # Process in batches
    for i in range(0, len(all_tags), batch_size):
        batch = all_tags[i:i+batch_size]
        batch_num = i // batch_size + 1

        print(f"\nBatch {batch_num}: Processing {len(batch)} tags...")

        rows = connector.fetch_history_data(
            tag_names=batch,
            date_from=start_time,
            date_to=end_time
        )

        total_rows += len(rows)
        print(f"  Retrieved {len(rows)} rows")

        # Process rows here (save to database, file, etc.)

    print(f"\n✓ Total: {total_rows} rows processed")
```

## Step 7: Incremental Sync Pattern

Implement an incremental sync to only fetch new data:

```python
# incremental_sync.py
from wonderware import WonderwareConnector
from datetime import datetime
import json
import os

WATERMARK_FILE = 'last_sync_time.txt'

def get_last_sync_time():
    """Get the last sync timestamp from file."""
    if os.path.exists(WATERMARK_FILE):
        with open(WATERMARK_FILE, 'r') as f:
            return f.read().strip()
    else:
        # Default: 1 hour ago
        return (datetime.now() - timedelta(hours=1)).isoformat()

def save_sync_time(timestamp):
    """Save the current sync timestamp."""
    with open(WATERMARK_FILE, 'w') as f:
        f.write(timestamp)

def sync_new_data():
    """Fetch only new data since last sync."""
    with WonderwareConnector.build_from_env() as connector:
        # Get sync times
        last_sync = get_last_sync_time()
        current_time = datetime.now().isoformat()

        print(f"Syncing data from {last_sync} to {current_time}")

        # Get tags to monitor
        tags = ["Temperature_Reactor_01", "Pressure_Tank_02"]

        # Fetch new data (exclusive start to avoid duplicates)
        rows = connector.fetch_history_data(
            tag_names=tags,
            date_from=last_sync,
            date_to=current_time,
            inclusive_start=False  # Exclude start time
        )

        print(f"✓ Found {len(rows)} new data points")

        # Process new data here
        # ... save to database, send to API, etc.

        # Update watermark
        save_sync_time(current_time)
        print(f"✓ Watermark updated to {current_time}")

if __name__ == "__main__":
    sync_new_data()
```

Run this periodically (e.g., via cron):

```bash
# Run every minute
*/1 * * * * cd /path/to/project && python incremental_sync.py
```

## Step 8: Error Handling

Add robust error handling for production use:

```python
# production_example.py
from wonderware import WonderwareConnector
from wonderware.connection_manager import CircuitBreakerOpenError
import logging
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def fetch_data_with_retry(connector, tags, start, end, max_retries=3):
    """Fetch data with retry logic."""
    for attempt in range(max_retries):
        try:
            rows = connector.fetch_history_data(
                tag_names=tags,
                date_from=start,
                date_to=end
            )
            return rows

        except CircuitBreakerOpenError:
            logger.error("Circuit breaker is open - waiting before retry")
            time.sleep(60)  # Wait 1 minute

        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(5 * (attempt + 1))  # Exponential backoff
            else:
                raise

    return []

def main():
    connector = None
    try:
        # Initialize connector
        connector = WonderwareConnector.build_from_env()

        # Test connection
        if not connector.test_connection():
            logger.error("Cannot connect to Wonderware")
            return

        # Fetch data with retry
        tags = ["Temperature_Reactor_01"]
        rows = fetch_data_with_retry(
            connector,
            tags,
            "2026-02-06T00:00:00",
            "2026-02-06T01:00:00"
        )

        logger.info(f"Successfully retrieved {len(rows)} rows")

    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)

    finally:
        if connector:
            connector.close()

if __name__ == "__main__":
    main()
```

## Common Patterns

### Pattern 1: Data Export to CSV

```python
import csv
from wonderware import WonderwareConnector

with WonderwareConnector.build_from_env() as connector:
    rows = connector.fetch_history_data(
        tag_names=["Temperature_Reactor_01"],
        date_from="2026-02-06T00:00:00",
        date_to="2026-02-06T01:00:00"
    )

    # Write to CSV
    with open('wonderware_export.csv', 'w', newline='') as f:
        if rows:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)

    print(f"✓ Exported {len(rows)} rows to CSV")
```

### Pattern 2: Data Validation

```python
from wonderware import WonderwareConnector

with WonderwareConnector.build_from_env() as connector:
    rows = connector.fetch_history_data(
        tag_names=["Temperature_Reactor_01"],
        date_from="2026-02-06T00:00:00",
        date_to="2026-02-06T01:00:00"
    )

    # Validate data quality
    valid_rows = []
    for row in rows:
        # Check quality (192 = good quality in Wonderware)
        if row['Quality'] == 192 and row['Value'] is not None:
            valid_rows.append(row)

    print(f"✓ {len(valid_rows)}/{len(rows)} rows have good quality")
```

### Pattern 3: Real-time Monitoring

```python
import time
from wonderware import WonderwareConnector
from datetime import datetime

def monitor_tags(interval_seconds=60):
    """Monitor tags in real-time."""
    with WonderwareConnector.build_from_env() as connector:
        tags = ["Temperature_Reactor_01", "Pressure_Tank_02"]
        last_check = datetime.now()

        while True:
            current_time = datetime.now()

            # Fetch new data
            rows = connector.fetch_history_data(
                tag_names=tags,
                date_from=last_check.isoformat(),
                date_to=current_time.isoformat(),
                inclusive_start=False
            )

            # Process new values
            for row in rows:
                print(f"{row['DateTime']} | {row['TagName']}: {row['Value']}")

            last_check = current_time
            time.sleep(interval_seconds)

# Run monitoring
monitor_tags(interval_seconds=60)
```

## Next Steps

Now that you're familiar with the basics:

1. **Explore the API** - See [API Reference](api-reference.md) for all available methods
2. **Configure Advanced Options** - See [Configuration Guide](configuration.md) for connection pooling, circuit breakers, etc.
3. **Build a Pipeline** - Check out the [Wonderware to ClickHouse pipeline](https://registry.514.ai/pipelines/wonderware_to_clickhouse) for a complete example
4. **Monitor in Production** - Implement logging, monitoring, and alerting for production deployments

## Troubleshooting

### Issue: "Cannot connect to SQL Server"

**Solution**: Check network connectivity and firewall rules
```bash
telnet your-wonderware-host 1433
```

### Issue: "No tags returned"

**Solution**: Verify database name and table permissions
```python
# Check if TagRef table exists
from wonderware import WonderwareConnector
connector = WonderwareConnector.build_from_env()
# Run a test query manually
```

### Issue: "Authentication failed"

**Solution**: Verify credentials and SQL Server authentication mode

### Issue: "Too many rows, query timeout"

**Solution**: Use smaller date ranges or process in batches

## Support

- **Documentation**: https://registry.514.ai/connectors/wonderware
- **GitHub Issues**: https://github.com/514-labs/registry/issues
- **Examples**: See `examples/` directory in the connector package
