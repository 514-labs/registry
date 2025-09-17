# Testing Observability Features

This document explains how to test the observability features (logging and metrics) in the Dutchie connector.

## Unit tests

- Logging hooks: verify level filtering, optional inclusion of query/headers/body
- Metrics hooks: verify request/response/error/retry events and durations

## Enabling observability

```ts
import { createDutchieConnector, InMemoryMetricsSink, createMetricsHooks } from "@workspace/connector-dutchie";

const dutchie = createDutchieConnector();
dutchie.initialize({
  auth: { type: "basic", basic: { username: process.env.DUTCHIE_API_KEY! } },
  logging: { enabled: true, level: "info" },
});

const sink = new InMemoryMetricsSink();
const hooks = createMetricsHooks(sink);
// Compose manually if desired
```

## Example assertions

```ts
// Logging: use a custom logger to capture events
const events: any[] = [];
const dutchie = createDutchieConnector();
dutchie.initialize({
  auth: { type: "basic", basic: { username: "test" } },
  logging: { enabled: true, level: "info" },
});

// Metrics: inspect sink.events after calls
```

## Environment variables

For integration tests that hit the live API, set:

```bash
export DUTCHIE_API_KEY="your-api-key"
```

Most tests should use mocks (e.g., `nock`) and won't require a real key.
