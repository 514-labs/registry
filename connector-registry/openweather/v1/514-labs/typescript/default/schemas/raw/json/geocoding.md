# Geocoding API

Convert between location names and geographic coordinates.

## Description

The Geocoding API provides:
- **Direct geocoding**: Convert location names to coordinates
- **Reverse geocoding**: Convert coordinates to location names
- **Zip code geocoding**: Get coordinates for zip/post codes

## API Endpoints

```
GET /geo/1.0/direct   # Location name to coordinates
GET /geo/1.0/reverse  # Coordinates to location name
GET /geo/1.0/zip      # Zip code to coordinates
```

## Direct Geocoding

Convert location name to geographic coordinates.

**Parameters:**
- `q`: Location name (city name, state code for US, country code)
- `limit`: Number of results to return (1-5, default 1)

**Example:**
```
q=London,GB&limit=5
```

Returns array of locations matching the query.

## Reverse Geocoding

Convert geographic coordinates to location names.

**Parameters:**
- `lat`: Latitude
- `lon`: Longitude
- `limit`: Number of results to return (1-5, default 1)

**Example:**
```
lat=51.5074&lon=-0.1278&limit=5
```

Returns array of locations at or near the coordinates.

## Zip Code Geocoding

Get geographic coordinates for a zip/post code.

**Parameters:**
- `zip`: Zip/post code and country code (e.g., "94040,US")

**Example:**
```
zip=94040,US
```

Returns single location object.

## Response Fields

- `name`: Location name
- `local_names`: Object with location names in different languages (if available)
- `lat`: Latitude
- `lon`: Longitude
- `country`: ISO 3166 country code
- `state`: State/province (for US and other applicable countries)

## Common Use Cases

**Find coordinates for a city:**
```
q=Paris,FR
```

**Find multiple matches:**
```
q=London&limit=5
```

**Get location name from coordinates:**
```
lat=40.7128&lon=-74.0060
```

**Geocode zip code:**
```
zip=E1 6AN,GB
```

## Location Name Format

Format: `{city name},{state code},{country code}`

- City name is required
- State code (US only) is optional
- Country code (ISO 3166) is recommended

Examples:
- `London,GB`
- `New York,NY,US`
- `Paris,FR`

## Rate Limits

Free tier: 60 calls/minute

## Documentation

https://openweathermap.org/api/geocoding-api
