# Klaviyo Connector Configuration

## Required Configuration

### `apiKey` (string, required)
Your Klaviyo Private API Key. Obtain this from the [Klaviyo API Keys Settings](https://www.klaviyo.com/settings/account/api-keys).

```typescript
const connector = createConnector()
connector.init({
  apiKey: 'pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
})
```

**Security Note**: Never commit your API key to version control. Use environment variables.

## Optional Configuration

### `revision` (string, optional)
API revision date to use. Default: `'2024-10-15'`

Klaviyo uses date-based API versioning. Specify a different revision if needed:

```typescript
connector.init({
  apiKey: process.env.KLAVIYO_API_KEY!,
  revision: '2024-10-15',
})
```

### `timeoutMs` (number, optional)
Request timeout in milliseconds. Default: `30000` (30 seconds)

```typescript
connector.init({
  apiKey: process.env.KLAVIYO_API_KEY!,
  timeoutMs: 60000, // 60 seconds
})
```

### `logging` (object, optional)
Enable request/response logging for debugging:

```typescript
connector.init({
  apiKey: process.env.KLAVIYO_API_KEY!,
  logging: {
    enabled: true,
    level: 'debug', // 'debug' | 'info' | 'warn' | 'error'
    includeQueryParams: true,
    includeHeaders: false,
    includeBody: true,
  },
})
```

### `metrics` (object, optional)
Enable metrics collection:

```typescript
connector.init({
  apiKey: process.env.KLAVIYO_API_KEY!,
  metrics: {
    enabled: true,
  },
})
```

## Pagination Options

All list operations support pagination parameters:

```typescript
// Fetch 50 items per page
for await (const page of connector.profiles.list({ pageSize: 50 })) {
  // Process page
}

// Limit total items fetched
for await (const page of connector.profiles.list({ maxItems: 1000 })) {
  // Will stop after fetching 1000 items total
}
```

## Filtering

### Profiles

```typescript
// Filter by email
for await (const page of connector.profiles.list({
  'filter[email]': 'user@example.com',
})) {
  // Process page
}

// Filter by phone number
for await (const page of connector.profiles.list({
  'filter[phone_number]': '+1234567890',
})) {
  // Process page
}

// Filter by IDs (comma-separated)
for await (const page of connector.profiles.list({
  'filter[ids]': 'id1,id2,id3',
})) {
  // Process page
}
```

## Advanced Configuration

The connector extends `@connector-factory/core` and supports all core configuration options including:

- **Retry**: Configure automatic retry behavior
- **Rate Limiting**: Respect API rate limits
- **Hooks**: Add custom request/response interceptors

See the [@connector-factory/core documentation](https://github.com/514-labs/registry/tree/main/packages/core) for details.

