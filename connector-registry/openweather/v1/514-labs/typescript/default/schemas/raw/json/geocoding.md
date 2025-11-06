# Geocoding API

Convert between location names and geographic coordinates.

## API Endpoints

```
GET /geo/1.0/direct   # Get coordinates by location name
GET /geo/1.0/reverse  # Get location name by coordinates
GET /geo/1.0/zip      # Get coordinates by ZIP/postal code
```

## Direct Geocoding (by location name)

Get geographic coordinates for a city, state, or country.

### Query Parameters
- `q` - Location name (city, state, country)
  - Format: `{city name}`, `{city},{state}`, `{city},{country}`, or `{city},{state},{country}`
  - Example: `London`, `London,GB`, `New York,NY,US`
- `limit` - Number of results to return (max 5, default 5)

### Example
```typescript
const locations = await conn.geocoding.getByLocationName({
  q: 'London',
  limit: 5
})
// Returns array of locations matching "London" (London UK, London Canada, etc.)
```

## Reverse Geocoding (by coordinates)

Get location information for geographic coordinates.

### Query Parameters
- `lat` - Latitude (required)
- `lon` - Longitude (required)
- `limit` - Number of results to return (max 5, default 1)

### Example
```typescript
const locations = await conn.geocoding.getByCoordinates({
  lat: 51.5074,
  lon: -0.1278,
  limit: 1
})
// Returns location info for these coordinates
```

## ZIP Code Geocoding

Get coordinates for a ZIP/postal code.

### Query Parameters
- `zip` - ZIP/postal code with country code
  - Format: `{zip code},{country code}`
  - Example: `94040,US` or `E14,GB`

### Example
```typescript
const location = await conn.geocoding.getByZipCode({
  zip: '94040,US'
})
// Returns: { zip: "94040", name: "Mountain View", lat: 37.3861, lon: -122.0839, country: "US" }
```

## Response Fields

- **name** - Location name (city/area)
- **lat** - Latitude
- **lon** - Longitude
- **country** - Country code (ISO 3166)
- **state** - State/region (when available, especially for US locations)
- **local_names** - Object with location names in different languages (direct geocoding only)

## Use Cases

1. **Search for cities**: Find coordinates for weather/forecast queries
2. **Reverse lookup**: Display location name for coordinates
3. **Address validation**: Verify ZIP codes and locations exist
4. **Multi-location search**: Get multiple matches for ambiguous names
