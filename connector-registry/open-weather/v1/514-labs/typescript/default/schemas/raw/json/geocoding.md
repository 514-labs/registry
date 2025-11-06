# Geocoding API

Convert between city names, zip codes, and geographic coordinates.

## API Endpoints

### Direct Geocoding
```
GET https://api.openweathermap.org/geo/1.0/direct
```
Convert city name to coordinates.

### Reverse Geocoding
```
GET https://api.openweathermap.org/geo/1.0/reverse
```
Convert coordinates to city name.

### Zip Code Lookup
```
GET https://api.openweathermap.org/geo/1.0/zip
```
Get location data by zip/postal code.

## Common Queries

Direct geocoding (city to coordinates):
```
q=London,UK&limit=5
```

Reverse geocoding (coordinates to city):
```
lat=51.5074&lon=-0.1278&limit=1
```

Zip code lookup:
```
zip=94040,US
```

## Parameters

- **q**: City name with optional state code and country code (format: "city,state,country")
- **lat/lon**: Geographic coordinates for reverse geocoding
- **zip**: Zip/postal code with country code (format: "zip,country")
- **limit**: Number of results to return (max 5)

## Response Fields

### Location Info
- **name**: Location name
- **local_names**: Names in different languages
- **lat**: Latitude
- **lon**: Longitude
- **country**: Country code (ISO 3166)
- **state**: State/region (if available)

### Zip Code Location
- **zip**: Zip/postal code
- **name**: Location name
- **lat**: Latitude
- **lon**: Longitude
- **country**: Country code

## Example Responses

Direct geocoding:
```json
[
  {
    "name": "London",
    "local_names": {
      "en": "London",
      "ja": "ロンドン"
    },
    "lat": 51.5085,
    "lon": -0.1257,
    "country": "GB",
    "state": "England"
  }
]
```

Reverse geocoding:
```json
[
  {
    "name": "City of Westminster",
    "lat": 51.5085,
    "lon": -0.1257,
    "country": "GB"
  }
]
```

Zip code lookup:
```json
{
  "zip": "94040",
  "name": "Mountain View",
  "lat": 37.3861,
  "lon": -122.0839,
  "country": "US"
}
```
