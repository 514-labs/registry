# Geocoding API

Convert between location names and geographic coordinates.

## Description

The Geocoding API provides:
- Forward geocoding (location name → coordinates)
- Reverse geocoding (coordinates → location name)
- ZIP/postal code lookup

## Endpoints

Forward geocoding:
```
GET /geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}
```

Reverse geocoding:
```
GET /geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}
```

ZIP code lookup:
```
GET /geo/1.0/zip?zip={zip code},{country code}
```

## Query Parameters

Forward geocoding:
- `q` - City name, state code (US only), country code divided by comma
- `limit` - Number of results (max 5, default 1)

Reverse geocoding:
- `lat` - Latitude
- `lon` - Longitude
- `limit` - Number of results (max 5, default 1)

ZIP code:
- `zip` - ZIP/post code and country code divided by comma

## Examples

- `q=London,UK`
- `q=New York,NY,US`
- `zip=10001,US`
- `zip=E14,GB`
