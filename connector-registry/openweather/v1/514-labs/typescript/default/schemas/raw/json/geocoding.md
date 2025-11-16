# Geocoding API

Convert between location names and geographic coordinates.

## API Endpoints

### Direct Geocoding
Convert location name to coordinates:
```
GET /geo/1.0/direct
```

### Reverse Geocoding
Convert coordinates to location name:
```
GET /geo/1.0/reverse
```

### Geocoding by ZIP/Postal Code
```
GET /geo/1.0/zip
```

## Parameters

### Direct Geocoding
- `q`: City name, state code (US only), and country code divided by comma
  - Example: `London,UK` or `New York,NY,US`
- `limit`: Number of locations to return (max 5, default 5)

### Reverse Geocoding
- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `limit`: Number of locations to return (max 5, default 5)

### ZIP Code Geocoding
- `zip`: ZIP/post code and country code divided by comma
  - Example: `E14,GB` or `94040,US`

## Response Fields

- `name`: Location name
- `local_names`: Name in different languages (object with language codes)
- `lat`: Latitude
- `lon`: Longitude
- `country`: Country code
- `state`: State or region (if available)

## Example Requests

### Direct Geocoding
```
GET /geo/1.0/direct?q=London&limit=5&appid=YOUR_API_KEY
```

### Reverse Geocoding
```
GET /geo/1.0/reverse?lat=51.5085&lon=-0.1257&limit=1&appid=YOUR_API_KEY
```

### ZIP Code
```
GET /geo/1.0/zip?zip=E14,GB&appid=YOUR_API_KEY
```

## Example Response

```json
[
  {
    "name": "London",
    "local_names": {
      "en": "London",
      "fr": "Londres",
      "es": "Londres",
      "ja": "ロンドン"
    },
    "lat": 51.5085,
    "lon": -0.1257,
    "country": "GB"
  }
]
```

## Common Use Cases

- Convert city names to coordinates for weather queries
- Display location names from GPS coordinates
- Validate and normalize location input
- Support multi-language location search
- Location autocomplete features
