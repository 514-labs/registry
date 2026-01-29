# Changelog

All notable changes to the QVD to ClickHouse pipeline will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1] - 2025-01-29

### Added
- Initial release of QVD to ClickHouse pipeline
- Universal file system support via fsspec (local, S3, HTTP, FTP, Azure, GCS)
- Automatic Pydantic model generation from QVD schemas
- Incremental file tracking with change detection
- Batch insertion into ClickHouse with configurable batch size
- Scheduled workflow execution (daily by default)
- CLI tool (`init_qvd.py`) for pipeline management:
  - List QVD files from any source
  - Generate models with include/exclude filters
  - Reset tracking state
- Smart change detection based on file metadata (mtime, ETag, size)
- File filtering with include/exclude patterns
- Comprehensive error handling and logging
- Support for AWS S3 with multiple credential methods
- State persistence in `.qvd_state.json`

### Features
- Read QVD files from any fsspec-supported filesystem
- Automatic schema introspection using pyqvd
- Generate Pydantic models with proper type mapping
- Efficient batch processing with configurable batch size
- Incremental updates - only process new or modified files
- Scheduled execution via Moose workflows
- Production-ready error handling and retry logic

### Configuration
- Environment variable-based configuration
- Support for `.env` files
- AWS credential flexibility (env vars, profile, IAM role)
- Configurable file patterns and filters
- Adjustable batch size and schedule

### Documentation
- Comprehensive README with installation guide
- Quick start guide for fast setup
- CLI tool documentation
- Troubleshooting section
- Architecture overview
