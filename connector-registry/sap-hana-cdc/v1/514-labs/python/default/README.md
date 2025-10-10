# sap-hana-cdc (Python)

Python-based Change Data Capture (CDC) connector for SAP HANA database with real-time streaming capabilities.

## Features

- **Real-time CDC**: Capture database changes as they happen
- **SAP HANA Integration**: Native support for SAP HANA database
- **Streaming Output**: Kafka integration for real-time data streaming
- **Configurable**: Flexible table and schema selection
- **High Performance**: Async/await support with optimized polling
- **Resilient**: Built-in retry logic and error handling

## Requirements

- Python 3.10+
- SAP HANA database access
- Kafka cluster (for streaming output)

## Installation

```bash
pip install -e .
```

## Quick Start

1. **Configure Environment**
   ```bash
   cp env.example .env
   # Edit .env with your SAP HANA and Kafka settings
   ```

2. **Run CDC Pipeline**
   ```bash
   sap-hana-cdc run --config config.yaml
   ```

3. **Monitor Changes**
   ```bash
   # Changes will be streamed to Kafka topic: sap-hana-cdc
   kafka-console-consumer --bootstrap-server localhost:9092 --topic sap-hana-cdc
   ```

## Configuration

See `docs/configuration.md` for detailed configuration options.

## Architecture

The connector implements a CDC pattern with the following components:

- **Extractor**: Monitors SAP HANA for changes using database triggers/logs
- **Transformer**: Processes and normalizes change events
- **Loader**: Streams changes to Kafka for downstream consumption

## APIs

- **CDC Stream**: Real-time change events via Kafka
- **Health Check**: `GET /health` - Pipeline health status
- **Metrics**: `GET /metrics` - Performance and throughput metrics

## Examples

See `examples/` directory for usage examples and integration patterns.
