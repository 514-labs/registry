# Testing Observability Features

This document explains how to test the observability features (logging and metrics) in this HubSpot to ClickHouse pipeline project.

## Test Structure

The observability tests are organized into several categories:

### Unit Tests (`app/hubspot/tests/unit/`)

- **`observability-logging.test.ts`** - Tests for logging hooks with different configuration options
- **`observability-metrics.test.ts`** - Tests for metrics hooks and in-memory sink functionality

### Integration Tests (`app/hubspot/tests/integration/`)

- **`observability-automatic.test.ts`** - Tests showing automatic logging/metrics enablement via flags
- **`observability-manual.test.ts`** - Tests demonstrating manual composition with direct sink access
- **`observability-interop.test.ts`** - Tests showing observability hooks working with existing custom hooks

### Project-Level Tests (`tests/`)

- **`observability-integration.test.ts`** - Integration test showing observability in the context of the Moose pipeline

## Running the Tests

### Prerequisites

Make sure you have the required dependencies installed:

```bash
# In the main project directory
pnpm install

# In the HubSpot connector directory
cd app/hubspot
pnpm install
```

### Running HubSpot Connector Tests

```bash
cd app/hubspot

# Run all tests
pnpm test

# Run specific observability tests
pnpm test -- observability-logging.test.ts
pnpm test -- observability-metrics.test.ts

# Run integration tests (may require HUBSPOT_TOKEN)
pnpm run test:integration
```

### Running Project-Level Tests

```bash
# From project root
pnpm test -- tests/observability-integration.test.ts

# Or run all tests
pnpm test
```

## Test Configuration

If you encounter test runner configuration issues, you may need to ensure:

1. **Jest Configuration** (for HubSpot connector tests):
   - `ts-jest` is properly configured in `app/hubspot/jest.config.cjs`
   - TypeScript paths are resolved correctly

2. **Vitest Configuration** (for project-level tests):
   - `vitest.config.ts` is properly configured
   - Import paths for HubSpot connector are correct

## Testing Patterns Demonstrated

### 1. Automatic Configuration Testing
```typescript
// Test enabling observability with simple flags
const connector = createHubSpotConnector();
connector.initialize({
  auth: { type: "bearer", bearer: { token: "test-token" } },
  enableLogging: { level: "info" },
  enableMetrics: true,
});
```

### 2. Manual Composition Testing
```typescript
// Test direct access to metrics sink
const { hooks: metricsHooks, sink } = createMetricsHooks(
  { sink: new InMemoryMetricsSink() },
  { service: "hubspot" }
);

// Later: inspect sink.getSnapshot()
```

### 3. Custom Logger Testing
```typescript
// Test custom logging behavior
const loggedEvents = [];
const mockLogger = (level, event) => {
  loggedEvents.push({ level, event });
};

const hooks = createLoggingHooks({ 
  level: "info", 
  logger: mockLogger 
});
```

### 4. PII Protection Testing
```typescript
// Test PII control features
const hooks = createLoggingHooks({
  includeQueryParams: false,
  includeHeaders: false,
  includeBody: false,
});
```

### 5. Hook Priority Testing
```typescript
// Test hook execution order
const customHook = {
  name: "custom-hook",
  priority: 500, // Execute before observability (1000)
  execute: (ctx) => { /* custom logic */ }
};
```

## Environment Variables

For tests that make actual API calls:

```bash
export HUBSPOT_TOKEN="your-hubspot-private-app-token"
```

**Note:** Most tests use mocked requests and don't require a real token.

## Examples

See the comprehensive examples in:
- **`examples/observability-examples.ts`** - Runnable examples showing all patterns

To run the examples:
```bash
# Set token (optional, examples work without it for demo)
export HUBSPOT_TOKEN="your-token"

# Run examples
npx tsx examples/observability-examples.ts
```

## Test Coverage

The tests cover:

✅ **Logging Features**
- Different log levels and filtering  
- PII protection (query params, headers, body)
- Custom logger functions
- Request/response/error/retry events

✅ **Metrics Features**
- Counter increments
- Duration observations
- Label handling and sorting
- Custom sinks
- Static label application

✅ **Configuration**
- Automatic enablement via flags
- Manual composition with direct sink access
- Hook priority and execution order
- Integration with existing custom hooks

✅ **Error Handling**
- Graceful handling of malformed requests
- Missing data scenarios
- Invalid configuration

✅ **Pipeline Integration**
- Data quality monitoring
- Performance tracking
- Business metrics alongside observability
- CI/CD testing patterns

## Troubleshooting

### Jest Configuration Issues
If you see `Module ts-jest in the transform option was not found`:

```bash
cd app/hubspot
pnpm install ts-jest --save-dev
```

### Import Path Issues
Make sure the import paths in tests match the actual file structure:

```typescript
import { createHubSpotConnector } from "../../src";
```

### Vitest ESM Issues
For Vitest/ESM issues, ensure `vitest.config.ts` is properly configured for the project structure.

## Key Testing Takeaways

1. **Unit tests** verify individual hook behavior and configuration options
2. **Integration tests** show how observability works with the full connector
3. **Manual composition** enables testing with direct access to metrics data
4. **Automatic flags** provide the simplest setup for basic observability
5. **Custom sinks** allow integration with external monitoring systems
6. **Hook interoperability** ensures observability works with existing code

The tests demonstrate all the patterns described in the observability documentation and provide a foundation for monitoring the HubSpot to ClickHouse data pipeline.
