# Wonderware Historian Connector

A high-performance connector for extracting data from AVEVA Wonderware Historian systems.

## Overview

This connector provides reliable, efficient access to Wonderware Historian data through SQL Server queries. It supports tag discovery and historical data extraction with built-in connection pooling and circuit breaker patterns for production reliability.

## Features

- **Tag Discovery**: Automatically discover all available tags from the Wonderware TagRef table
- **Historical Data Extraction**: Fetch time-series data from the History view with flexible date ranges
- **Connection Management**: Built-in connection pooling and circuit breaker for resilience
- **Health Checks**: Test connectivity and get system status

## Capabilities

- **Extract**: ✅ Yes
- **Transform**: ❌ No
- **Load**: ❌ No

## Source System

- **Type**: Historian
- **Specification**: AVEVA Wonderware Historian
- **Backend**: SQL Server

## Versions

- `v1`: Initial release with core extraction capabilities

## Usage

See version-specific documentation for detailed usage instructions.
