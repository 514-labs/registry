# CDC Status CLI Usage

The `cdc_status.py` script can now be executed directly from the command line to get CDC status information.

## Usage

### Basic Usage
```bash
python cdc_status.py
```

### With Specific Client ID
```bash
python cdc_status.py --client-id my_client
```

### JSON Output
```bash
python cdc_status.py --json
```

### Verbose Logging
```bash
python cdc_status.py --verbose
```

### Help
```bash
python cdc_status.py --help
```

## Examples

### Default Output
```
CDC Status Report
==================================================
Client ID: default
Total entries: 150
Lag seconds: 120
Max timestamp: 2024-01-15T10:30:00
Last client update: 2024-01-15T10:28:00

Status: ⚠️  2 minutes behind
```

### JSON Output
```json
{
  "total_entries": 150,
  "lag_seconds": 120,
  "max_timestamp": "2024-01-15T10:30:00",
  "last_client_update": "2024-01-15T10:28:00"
}
```

## Status Interpretations

- ✅ **Up to date**: Lag = 0 seconds
- ⚠️ **Seconds behind**: Lag < 60 seconds
- ⚠️ **Minutes behind**: Lag < 3600 seconds (1 hour)
- ❌ **Hours behind**: Lag ≥ 3600 seconds

## Requirements

- SAP HANA CDC connector dependencies
- Environment variables configured (SAP_HANA_*)
- Database connection available
