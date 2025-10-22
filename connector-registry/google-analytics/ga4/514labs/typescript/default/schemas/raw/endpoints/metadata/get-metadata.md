# Get Metadata

Returns metadata for all dimensions and metrics available in the property.

## Endpoint

`GET /v1beta/properties/{propertyId}/metadata`

## Use Cases

- Discover available dimensions and metrics
- Build dynamic report builders
- Validate report configurations
- Document API capabilities

## Response Structure

Returns a list of all dimensions and metrics with:
- API name (used in queries)
- UI name (display name)
- Description
- Data type (for metrics)
- Custom vs standard fields
- Category grouping

## Example

```typescript
const metadata = await conn.metadata.getMetadata(propertyId)

console.log(`Available dimensions: ${metadata.dimensions.length}`)
console.log(`Available metrics: ${metadata.metrics.length}`)

// Find a specific dimension
const dateDim = metadata.dimensions.find(d => d.apiName === 'date')
console.log(dateDim.description)
```

## Sample Dimension Metadata

```json
{
  "apiName": "country",
  "uiName": "Country",
  "description": "The country from which the user activity originated",
  "customDefinition": false,
  "category": "Geography"
}
```

## Sample Metric Metadata

```json
{
  "apiName": "activeUsers",
  "uiName": "Active Users",
  "description": "The number of distinct users who visited your site or app",
  "type": "TYPE_INTEGER",
  "customDefinition": false,
  "category": "User"
}
```
