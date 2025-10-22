# Audience Exports

Audience Exports allow you to export snapshots of users in specific audiences.

## Endpoints

### List Audience Exports
`GET /v1beta/properties/{propertyId}/audienceExports`

### Create Audience Export
`POST /v1beta/properties/{propertyId}/audienceExports`

### Get Audience Export
`GET /v1beta/{name}`

### Query Audience Export
`POST /v1beta/{name}:query`

## Workflow

1. **Create** an audience export with dimensions
2. **Poll** the export status until ACTIVE
3. **Query** the export to retrieve user data
4. **List** all exports to see available snapshots

## Example: Create Export

```typescript
const audienceExport = await conn.audienceExports.create(propertyId, {
  audienceExport: {
    audience: 'properties/123/audiences/456',
    dimensions: [
      { name: 'deviceCategory' },
      { name: 'country' }
    ]
  }
})
```

## Example: Query Export Data

```typescript
const data = await conn.audienceExports.query(audienceExport.name, {
  offset: 0,
  limit: 1000
})

console.log(`Retrieved ${data.rowCount} users`)
data.audienceRows.forEach(row => {
  console.log(row.dimensionValues)
})
```

## Common Use Cases

- Export users for marketing campaigns
- Analyze audience characteristics offline
- Build custom user segments
- Data warehouse integration
