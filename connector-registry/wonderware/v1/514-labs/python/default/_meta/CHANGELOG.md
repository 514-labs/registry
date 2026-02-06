# Changelog

All notable changes to the Wonderware Historian connector will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-06

### Added
- Initial release of Wonderware Historian connector
- Tag discovery from TagRef table
- Historical data extraction from History view
- Connection pooling with SQLAlchemy
- Circuit breaker pattern for resilient connections
- Health check and status reporting
- Support for SQL Server backend via python-tds driver
