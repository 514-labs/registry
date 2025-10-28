# Google Analytics GA4 Connector (TypeScript)

Official TypeScript connector for Google Analytics 4 (GA4) API, built on the 514 Labs Registry framework.

## Overview

This connector provides type-safe access to the Google Analytics Data API (GA4) with built-in support for:

- Multiple authentication methods (Service Account, OAuth 2.0, API Key)
- Automatic pagination and streaming
- Request/response logging and metrics
- Rate limiting and retry logic
- Type-safe resource interfaces

## Quick Start

### 1. Install Dependencies

```bash
bash -i <(curl https://registry.514.ai/install.sh) --type connector google-analytics v4 514-labs typescript data-api
```

### 2. Set Up Credentials

Copy the example environment file and add your Google Analytics credentials:

```bash
cp .env.example .env
```

See the [Getting Started Guide](./docs/getting-started.md) for detailed instructions on obtaining credentials.

### 3. Run the Example

```bash
pnpm tsx examples/basic-usage.ts
```

## Authentication Options

### Service Account (Recommended)
Best for server-to-server integrations and production environments.

```typescript
conn.initialize({
  baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
  auth: {
    type: 'oauth2',
    oauth2: {
      grantType: 'jwt',
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      privateKey: process.env.GOOGLE_PRIVATE_KEY!,
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    }
  }
})
```

### OAuth 2.0
For user-based access and interactive applications.

```typescript
conn.initialize({
  baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
  auth: {
    type: 'oauth2',
    oauth2: {
      grantType: 'refresh_token',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
      tokenUrl: 'https://oauth2.googleapis.com/token'
    }
  }
})
```

## Usage Examples

### Fetch Reports with Pagination

```typescript
import { createConnector } from '@514labs/connector-google-analytics'

const conn = createConnector()
conn.initialize({ /* auth config */ })

// Automatic pagination
for await (const page of conn.reports.getAll({ pageSize: 100, maxItems: 500 })) {
  console.log(`Received ${page.length} reports`)
  page.forEach(report => console.log(report))
}
```

### Stream Large Datasets

```typescript
// Memory-efficient streaming
for await (const item of conn.reports.stream({ pageSize: 100 })) {
  console.log('Processing item:', item)
}
```

### Fetch a Single Report

```typescript
const report = await conn.reports.get('report-id')
console.log(report)
```

## Project Structure

```
.
├── src/
│   ├── client/
│   │   └── connector.ts         # Main connector class
│   ├── resources/
│   │   ├── reports.ts           # Reports resource implementation
│   │   └── index.ts             # Resource exports
│   ├── lib/
│   │   ├── make-resource.ts     # Resource factory utilities
│   │   └── paginate.ts          # Pagination helpers
│   ├── observability/
│   │   ├── logging-hooks.ts     # Request/response logging
│   │   └── metrics-hooks.ts     # Performance metrics
│   └── index.ts                 # Package entry point
├── schemas/
│   ├── raw/                     # Raw API response schemas
│   └── extracted/               # Extracted/transformed schemas
├── examples/
│   └── basic-usage.ts           # Example implementation
├── tests/
│   ├── resource.test.ts         # Resource unit tests
│   └── observability.test.ts   # Observability tests
└── docs/
    ├── getting-started.md       # Setup and authentication guide
    ├── configuration.md         # Configuration options
    ├── schema.md                # Data schemas documentation
    ├── limits.md                # API rate limits and quotas
    └── observability.md         # Logging and metrics guide
```

## Configuration

### Logging

Enable request/response logging for debugging:

```typescript
conn.initialize({
  // ... auth config
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
    includeHeaders: false,
    includeBody: true
  }
})
```

### Metrics

Track API performance and usage:

```typescript
conn.initialize({
  // ... auth config
  metrics: { enabled: true }
})
```

### Rate Limiting

Configure retry behavior for rate limits:

```typescript
conn.initialize({
  // ... auth config
  retry: {
    limit: 3,
    delay: 1000,
    backoff: 'exponential'
  }
})
```

## Available Resources

Currently implemented resources:

- **reports**: Access GA4 report data

Additional resources can be added by creating new resource files in `src/resources/` and registering them in the connector class.

## Testing

Run the test suite:

```bash
pnpm -F @514labs/connector-google-analytics test
```

Run tests in watch mode:

```bash
pnpm -F @514labs/connector-google-analytics test --watch
```

## Documentation

- [Getting Started Guide](./docs/getting-started.md) - Complete setup instructions
- [Configuration Reference](./docs/configuration.md) - All configuration options
- [Schema Documentation](./docs/schema.md) - Data structures and types
- [API Limits](./docs/limits.md) - Rate limits and quotas
- [Observability](./docs/observability.md) - Logging and monitoring

## Development

### Adding New Resources

1. Create a new resource file in `src/resources/`:

```typescript
// src/resources/dimensions.ts
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'

export interface Dimension {
  id: string
  name: string
  // ... other fields
}

export const createResource = (send: SendFn) =>
  makeCrudResource<Dimension, {}>('/dimensions', send, {
    buildListQuery: (params) => ({ ...params }),
  })
```

2. Register it in the connector class:

```typescript
// src/client/connector.ts
import { createResource as createDimensionsResource } from '../resources/dimensions'

export class Connector extends ApiConnectorBase {
  // ... existing code

  get dimensions() {
    return createDimensionsResource(this.sendLite as any)
  }
}
```

### Building

Compile TypeScript to JavaScript:

```bash
pnpm -F @514labs/connector-google-analytics build
```

## Pattern Used

This connector uses **Pattern A (Simple/Dutchie-style)** from the Registry framework, which is suitable for APIs that:

- Return complete datasets without server-side pagination
- Support simple query parameters for filtering
- Don't require complex cursor or offset-based pagination

The pattern provides:
- `getAll()` - Paginated fetching with client-side chunking
- `get(id)` - Fetch a single resource by ID
- `list(params)` - Fetch with custom query parameters
- `stream()` - Memory-efficient streaming for large datasets

## Support

For issues, questions, or contributions:

- GitHub: [514labs/registry](https://github.com/514labs/registry)
- Documentation: [514 Labs Registry Docs](https://registry.514.dev)

## License

See [LICENSE](../../_meta/LICENSE) file in the connector directory.

## Related Resources

- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [514 Labs Registry Framework](https://github.com/514labs/registry)
- [Connector Specifications](https://registry.514.dev/docs/specifications/)

---

Built with the 514 Labs Registry framework for reliable, type-safe API integrations.
