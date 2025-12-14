# Configuration

⚠️ **This is a test connector - do not use in production**

## Configuration Options

### Required Configuration
None - this is a minimal test connector

### Optional Configuration

- `apiKey`: Test API key (optional)
  - Type: `string`
  - Default: none

- `baseUrl`: Base URL for API calls (optional)
  - Type: `string`
  - Default: `https://api.example.com`

## Example

```typescript
const connector = createConnector()
connector.init({
  apiKey: 'test-key',
  baseUrl: 'https://custom.example.com'
})
```
