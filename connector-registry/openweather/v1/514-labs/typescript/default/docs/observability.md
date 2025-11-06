# Observability

## Logging
```ts
conn.init({
  logging: { enabled: true, level: 'info', includeQueryParams: true, includeHeaders: true, includeBody: false }
})
```
Emits http_request and http_response with optional fields.

## Metrics
```ts
import { createMetricsHooks, InMemoryMetricsSink } from '../src/observability/metrics-hooks'
const sink = new InMemoryMetricsSink()
conn.init({ hooks: createMetricsHooks(sink) })
```
Inspect sink.events for telemetry.
