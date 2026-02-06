# Pipeline Configuration Guide

Complete reference for configuring the Wonderware to ClickHouse pipeline.

## Table of Contents

- [Configuration Overview](#configuration-overview)
- [Connector Configuration](#connector-configuration)
- [Pipeline Configuration](#pipeline-configuration)
- [ClickHouse Configuration](#clickhouse-configuration)
- [Redis Configuration](#redis-configuration)
- [Performance Tuning](#performance-tuning)
- [Security Configuration](#security-configuration)
- [Environment-Specific Configuration](#environment-specific-configuration)

## Configuration Overview

The pipeline uses a **two-namespace configuration model**:

| Namespace | Purpose | Example Variables |
|-----------|---------|-------------------|
| `WONDERWARE_*` | Connector configuration (SQL Server) | `WONDERWARE_HOST`, `WONDERWARE_USERNAME` |
| `WONDERWARE_PIPELINE_*` | Pipeline behavior (ClickHouse, workflows) | `WONDERWARE_PIPELINE_TAG_CHUNK_SIZE` |

This separation allows:
- ✅ Connector can be reused by other pipelines without conflicts
- ✅ Clear separation of concerns (data access vs. storage)
- ✅ Independent configuration of each component

## Connector Configuration

### WONDERWARE_HOST (Required)

SQL Server hostname or IP address where Wonderware Historian is running.

```bash
export WONDERWARE_HOST=wonderware-server.example.com
# or
export WONDERWARE_HOST=192.168.1.100
```

### WONDERWARE_PORT (Optional)

SQL Server port. Default: `1433`

```bash
export WONDERWARE_PORT=1433
```

### WONDERWARE_DATABASE (Optional)

Wonderware database name. Default: `Runtime`

```bash
export WONDERWARE_DATABASE=Runtime
```

Most Wonderware installations use "Runtime". Only change if your installation differs.

### WONDERWARE_USERNAME (Optional)

SQL Server username. If not provided, uses Windows Authentication.

```bash
export WONDERWARE_USERNAME=historian_reader
```

**Recommended:** Create a read-only user with SELECT permissions only on TagRef and History.

### WONDERWARE_PASSWORD (Optional)

SQL Server password. Required if `WONDERWARE_USERNAME` is set.

```bash
export WONDERWARE_PASSWORD=secure_password
```

**Security:** Never commit passwords. Use environment variables or secrets manager.

### WONDERWARE_DRIVER (Optional)

SQLAlchemy driver for SQL Server. Default: `mssql+pytds`

```bash
export WONDERWARE_DRIVER=mssql+pytds  # Pure Python (recommended)
# or
export WONDERWARE_DRIVER=mssql+pyodbc  # Requires ODBC driver
```

**Drivers:**
- `mssql+pytds` - Pure Python, no external dependencies (recommended)
- `mssql+pyodbc` - Requires Microsoft ODBC Driver for SQL Server

For more connector configuration details, see [Connector Configuration Guide](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/docs/configuration.md).

## Pipeline Configuration

### WONDERWARE_PIPELINE_TAG_CHUNK_SIZE (Optional)

Number of tags to process in a single batch. Default: `10`

```bash
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=10
```

**Impact:**
- **Lower values (5-10)**: Smaller SQL queries, less memory, slower overall
- **Higher values (20-50)**: Larger queries, more memory, faster overall
- **Very high values (>100)**: May hit SQL Server query limits

**Recommendations:**
- Development: 5-10
- Production (small dataset): 20-30
- Production (large dataset): 30-50

### WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS (Optional)

Number of days to process in a single backfill chunk. Default: `1`

```bash
export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=1
```

**Impact:**
- **Lower values (1-2)**: More workflow iterations, better progress visibility, safer for large datasets
- **Higher values (7-14)**: Fewer iterations, faster completion, higher memory usage

**Recommendations:**
- Small dataset (<50 tags): 7-14 days
- Medium dataset (50-150 tags): 3-7 days
- Large dataset (>150 tags): 1-3 days

**Example calculation:**
- 150 tags, 30 days, chunk_size=10, chunk_days=1
- Tag chunks: 150 / 10 = 15
- Date chunks: 30 / 1 = 30
- Total work units: 15 × 30 = 450 iterations

### WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME (Optional)

Start date for historical backfill. Default: `2025-01-01 00:00:00`

```bash
export WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME="2024-01-01 00:00:00"
```

**Format:** ISO 8601 or `YYYY-MM-DD HH:MM:SS`

**Considerations:**
- Ensure this date is within your Wonderware data retention period
- Larger date ranges = longer backfill time
- Can run multiple backfills for different date ranges

### WONDERWARE_PIPELINE_TAG_CACHE_TTL (Optional)

Seconds to cache tag list in Redis. Default: `3600` (1 hour)

```bash
export WONDERWARE_PIPELINE_TAG_CACHE_TTL=3600
```

**Impact:**
- **Lower values (300-1800)**: More frequent tag discovery, catches new tags faster, higher SQL Server load
- **Higher values (3600-7200)**: Less SQL Server load, may miss new tags for hours

**Recommendations:**
- Stable environment (tags don't change): 7200 (2 hours)
- Dynamic environment (tags added frequently): 1800 (30 minutes)
- Development: 300 (5 minutes)

**Note:** If Redis is not available, tags are fetched from SQL Server every sync (every minute).

### WONDERWARE_PIPELINE_SYNC_SCHEDULE (Optional)

Cron expression for incremental sync workflow. Default: `*/1 * * * *` (every minute)

```bash
export WONDERWARE_PIPELINE_SYNC_SCHEDULE="*/1 * * * *"  # Every 1 minute
# or
export WONDERWARE_PIPELINE_SYNC_SCHEDULE="*/5 * * * *"  # Every 5 minutes
# or
export WONDERWARE_PIPELINE_SYNC_SCHEDULE="0 * * * *"    # Every hour
```

**Cron format:** `minute hour day month weekday`

**Recommendations:**
- Real-time requirements: `*/1 * * * *` (1 minute)
- Near real-time: `*/5 * * * *` (5 minutes)
- Batch processing: `0 * * * *` (hourly)

**Trade-offs:**
- More frequent: Lower latency, higher load
- Less frequent: Higher latency, lower load

## ClickHouse Configuration

### CLICKHOUSE_HOST (Optional)

ClickHouse server hostname. Default: Moose starts local instance

```bash
export CLICKHOUSE_HOST=localhost
```

### CLICKHOUSE_PORT (Optional)

ClickHouse HTTP port. Default: `18123`

```bash
export CLICKHOUSE_PORT=18123
```

### CLICKHOUSE_USER (Optional)

ClickHouse username. Default: `default`

```bash
export CLICKHOUSE_USER=default
```

### CLICKHOUSE_PASSWORD (Optional)

ClickHouse password. Default: empty

```bash
export CLICKHOUSE_PASSWORD=
```

### CLICKHOUSE_DB (Optional)

ClickHouse database name. Default: `local`

```bash
export CLICKHOUSE_DB=local
```

**Note:** Moose will create this database if it doesn't exist.

## Redis Configuration

### REDIS_HOST (Optional)

Redis server hostname. Default: Moose starts local instance

```bash
export REDIS_HOST=localhost
```

### REDIS_PORT (Optional)

Redis server port. Default: `6379`

```bash
export REDIS_PORT=6379
```

**Note:** Redis is optional. Pipeline works without it, but will query SQL Server more frequently.

## Performance Tuning

### Backfill Performance

**Problem:** Backfill taking too long (< 10K rows/minute)

**Configuration adjustments:**

```bash
# Increase batch sizes
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50       # Up from 10
export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7   # Up from 1

# Reduce caching overhead (if stable tags)
export WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200      # 2 hours
```

**Expected throughput after optimization:**
- 40-60K rows/minute with optimized settings
- Depends on: network latency, SQL Server performance, ClickHouse write speed

### Sync Performance

**Problem:** Sync falling behind (processing time > 1 minute)

**Configuration adjustments:**

```bash
# Reduce query frequency
export WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200      # Query tags less often

# Increase batch size
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=30

# If acceptable, reduce sync frequency
export WONDERWARE_PIPELINE_SYNC_SCHEDULE="*/5 * * * *"  # Every 5 minutes
```

### Memory Usage

**Problem:** High memory usage during backfill

**Configuration adjustments:**

```bash
# Reduce batch sizes
export WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=5        # Down from 10
export WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=1   # Down from 7
```

**Impact:** Slower processing but lower memory footprint

### Network Optimization

For remote SQL Server or ClickHouse:

1. **Use connection pooling** (already enabled in connector)
2. **Increase batch sizes** to reduce round trips
3. **Deploy pipeline closer** to SQL Server if possible
4. **Use compression** on ClickHouse connection (enabled by default)

## Security Configuration

### SQL Server Security

**1. Use read-only credentials:**

```sql
-- Create dedicated read-only user
CREATE LOGIN wonderware_readonly WITH PASSWORD = 'SecurePassword123';
USE Runtime;
CREATE USER wonderware_readonly FOR LOGIN wonderware_readonly;
GRANT SELECT ON TagRef TO wonderware_readonly;
GRANT SELECT ON History TO wonderware_readonly;
```

**2. Use environment variables (never hardcode):**

```bash
export WONDERWARE_USERNAME=wonderware_readonly
export WONDERWARE_PASSWORD=SecurePassword123
```

**3. Use secrets manager (production):**

```bash
# AWS Secrets Manager example
export WONDERWARE_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id wonderware/credentials \
  --query SecretString \
  --output text | jq -r .password)
```

### ClickHouse Security

**1. Set strong password:**

```bash
export CLICKHOUSE_PASSWORD=ClickHouseSecurePass456
```

**2. Restrict network access:**

```sql
-- In ClickHouse config
<users>
  <default>
    <password_sha256_hex>...</password_sha256_hex>
    <networks>
      <ip>192.168.1.0/24</ip>  -- Only allow internal network
    </networks>
  </default>
</users>
```

**3. Enable TLS (production):**

```bash
export CLICKHOUSE_PORT=8443  # HTTPS port
export CLICKHOUSE_SECURE=true
```

### Secrets Management

**Development (.env file):**

```bash
# .env (add to .gitignore!)
WONDERWARE_PASSWORD=DevPassword123
CLICKHOUSE_PASSWORD=DevClickHouse456
```

**Production (AWS Secrets Manager):**

```bash
# Fetch secrets at runtime
aws secretsmanager get-secret-value --secret-id wonderware/prod
```

**Production (HashiCorp Vault):**

```bash
# Fetch from Vault
vault kv get -field=password secret/wonderware
```

## Environment-Specific Configuration

### Development Environment

```bash
# .env.development
# Connector
WONDERWARE_HOST=localhost
WONDERWARE_USERNAME=dev_user
WONDERWARE_PASSWORD=dev_pass
WONDERWARE_DATABASE=Runtime_Dev

# Pipeline (conservative for dev)
WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=5
WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=1
WONDERWARE_PIPELINE_TAG_CACHE_TTL=300
WONDERWARE_PIPELINE_BACKFILL_OLDEST_TIME=2025-02-01 00:00:00

# Local services
CLICKHOUSE_HOST=localhost
REDIS_HOST=localhost
```

### Staging Environment

```bash
# .env.staging
# Connector
WONDERWARE_HOST=wonderware-staging.internal
WONDERWARE_USERNAME=staging_readonly
WONDERWARE_PASSWORD=${WONDERWARE_STAGING_PASSWORD}  # From secrets manager

# Pipeline (production-like)
WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=30
WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7
WONDERWARE_PIPELINE_TAG_CACHE_TTL=3600

# External services
CLICKHOUSE_HOST=clickhouse-staging.internal
REDIS_HOST=redis-staging.internal
```

### Production Environment

```bash
# .env.production
# Connector (use secrets manager!)
WONDERWARE_HOST=wonderware-prod.internal
WONDERWARE_USERNAME=prod_readonly
WONDERWARE_PASSWORD=${WONDERWARE_PROD_PASSWORD}  # From secrets manager

# Pipeline (optimized for performance)
WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50
WONDERWARE_PIPELINE_BACKFILL_CHUNK_DAYS=7
WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200

# External services
CLICKHOUSE_HOST=clickhouse-prod.internal
CLICKHOUSE_PORT=8443  # HTTPS
CLICKHOUSE_SECURE=true
REDIS_HOST=redis-prod.internal
```

## Configuration Validation

### Validate Before Starting

```python
#!/usr/bin/env python3
"""Validate pipeline configuration before starting."""

import os
import sys
from wonderware import WonderwareConnector

def validate_config():
    """Validate all required configuration."""
    errors = []

    # Check required connector config
    if not os.getenv('WONDERWARE_HOST'):
        errors.append('WONDERWARE_HOST is required')

    # Test connector connection
    try:
        connector = WonderwareConnector.build_from_env()
        if not connector.test_connection():
            errors.append('Cannot connect to Wonderware SQL Server')
        else:
            status = connector.get_status()
            print(f'✓ Connector OK: {status.tag_count} tags available')
        connector.close()
    except Exception as e:
        errors.append(f'Connector error: {e}')

    # Check optional but recommended
    if not os.getenv('REDIS_HOST'):
        print('ℹ Redis not configured - will start local instance')

    if errors:
        print('\n'.join(f'✗ {e}' for e in errors))
        sys.exit(1)
    else:
        print('✓ Configuration validated')

if __name__ == '__main__':
    validate_config()
```

Run before starting:
```bash
python validate_config.py
moose dev
```

## Configuration Best Practices

### 1. Use .env Files Per Environment

```
.env                    # Local dev (gitignored)
.env.development        # Dev template (committed)
.env.staging            # Staging template
.env.production.example # Prod template (no secrets)
```

### 2. Document Your Configuration

Add comments to your `.env` files:

```bash
# SQL Server connection (required)
WONDERWARE_HOST=192.168.1.100
WONDERWARE_USERNAME=readonly_user

# Performance tuning (adjust based on load testing)
WONDERWARE_PIPELINE_TAG_CHUNK_SIZE=50  # Increased for better throughput
WONDERWARE_PIPELINE_TAG_CACHE_TTL=7200 # Stable tag list
```

### 3. Version Control Templates

Commit `.env.example` files without secrets:

```bash
# .env.example
WONDERWARE_HOST=your-server-here
WONDERWARE_USERNAME=your-username
WONDERWARE_PASSWORD=your-password  # Load from secrets manager!
```

### 4. Validate on Startup

Add validation script to your startup process:

```bash
#!/bin/bash
set -e

# Load environment
source .env

# Validate
python scripts/validate_config.py

# Start pipeline
moose dev
```

### 5. Monitor Configuration Drift

Log active configuration on startup:

```python
import os
import logging

logger = logging.getLogger(__name__)

def log_config():
    """Log non-sensitive configuration."""
    logger.info(f"WONDERWARE_HOST: {os.getenv('WONDERWARE_HOST')}")
    logger.info(f"TAG_CHUNK_SIZE: {os.getenv('WONDERWARE_PIPELINE_TAG_CHUNK_SIZE')}")
    logger.info(f"CACHE_TTL: {os.getenv('WONDERWARE_PIPELINE_TAG_CACHE_TTL')}")
```

## Troubleshooting Configuration Issues

### Issue: "WONDERWARE_HOST environment variable is required"

**Cause:** Connector configuration not loaded

**Solution:**
```bash
# Verify environment
echo $WONDERWARE_HOST

# Load from .env
source .env

# Or export manually
export WONDERWARE_HOST=your-server
```

### Issue: Configuration changes not taking effect

**Cause:** Moose server cached old configuration

**Solution:**
```bash
# Stop Moose (Ctrl+C)
# Update configuration
source .env
# Restart
moose dev
```

### Issue: "Permission denied" errors

**Cause:** SQL Server user lacks required permissions

**Solution:**
```sql
-- Grant necessary permissions
GRANT SELECT ON TagRef TO wonderware_readonly;
GRANT SELECT ON History TO wonderware_readonly;
```

## Related Documentation

- [Getting Started Guide](getting-started.md)
- [Workflows Guide](workflows.md)
- [Connector Configuration](../../../../../../../connector-registry/wonderware/v1/514-labs/python/default/docs/configuration.md)
