# Google Analytics Data API v1beta Schemas

This directory contains JSON schemas organized into logical categories:

## Directory Structure

```
json/
├── properties-reporting/    # Core Analytics reporting endpoints
│   ├── batchRunReports.*
│   ├── batchRunPivotReports.*
│   ├── runReport.*
│   ├── runRealtimeReport.*
│   ├── runPivotReport.*
│   ├── checkCompatibility.*
│   └── getMetadata.*
│
├── audience-exports/        # Audience export endpoints
│   ├── audienceExports.create.*
│   ├── audienceExports.get.*
│   ├── audienceExports.list.*
│   └── audienceExports.query.*
│
└── types/                   # Shared type definitions
    ├── CohortSpec.*
    ├── Comparison.*
    ├── DateRange.*
    ├── Dimension.*
    ├── DimensionHeader.*
    ├── DimensionMetadata.*
    ├── DimensionValue.*
    ├── FilterExpression.*
    ├── Metric.*
    ├── MetricAggregation.*
    ├── MetricHeader.*
    ├── MetricMetadata.*
    ├── MetricType.*
    ├── OrderBy.*
    ├── Pivot.*
    ├── PropertyQuota.*
    ├── ResponseMetaData.*
    ├── Row.*
    ├── RunPivotReportResponse.*
    └── RunReportResponse.*
```

## Schema Organization

- **properties-reporting/**: Contains all Google Analytics properties reporting endpoints
- **audience-exports/**: Contains all audience export-related endpoints
- **types/**: Contains shared type definitions used across endpoints

Each schema file has:
- `.schema.json` - JSON Schema definition
- `.md` - Human-readable documentation

## Metadata

Schemas include metadata to distinguish:
- `"category": "endpoint"` - API endpoints with HTTP methods
- `"category": "type"` - Data type definitions
