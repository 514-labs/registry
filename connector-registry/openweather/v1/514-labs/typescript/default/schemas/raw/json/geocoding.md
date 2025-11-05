# Geocoding API

Convert between location names and geographic coordinates.

## Endpoints

### Direct Geocoding (by location name)
```
GET /geo/1.0/direct
```

### Reverse Geocoding (by coordinates)
```
GET /geo/1.0/reverse
```

### Geocoding by ZIP/Post Code
```
GET /geo/1.0/zip
```

## Query Parameters

### Direct Geocoding
- **q**: City name, state code (US only), and country code divided by comma. Format: `{city name},{state code},{country code}`
- **limit**: Number of locations in response (up to 5, default: 5)

### Reverse Geocoding
- **lat**: Latitude of the location
- **lon**: Longitude of the location
- **limit**: Number of locations in response (up to 5, default: 5)

### ZIP/Post Code
- **zip**: ZIP/post code and country code divided by comma. Format: `{zip code},{country code}`

## Example Responses

### Direct Geocoding Response
```json
[
  {
    "name": "London",
    "local_names": {
      "en": "London",
      "fr": "Londres",
      "es": "Londres"
    },
    "lat": 51.5085,
    "lon": -0.1257,
    "country": "GB"
  },
  {
    "name": "London",
    "lat": 42.9834,
    "lon": -81.233,
    "country": "CA",
    "state": "Ontario"
  }
]
```

### Reverse Geocoding Response
```json
[
  {
    "name": "London",
    "local_names": {
      "en": "London"
    },
    "lat": 51.5085,
    "lon": -0.1257,
    "country": "GB"
  }
]
```

### ZIP Code Response
```json
{
  "zip": "94040",
  "name": "Mountain View",
  "lat": 37.3861,
  "lon": -122.0839,
  "country": "US"
}
```

## Common Queries

Search for a city:
```
q=London
```

Search for a city in a specific country:
```
q=London,UK
```

Search for a city in a US state:
```
q=London,KY,US
```

Reverse geocode coordinates:
```
lat=51.5085&lon=-0.1257
```

Geocode by ZIP code:
```
zip=94040,US
```

Limit results:
```
q=Paris&limit=3
```

## Documentation

See [OpenWeatherMap Geocoding API](https://openweathermap.org/api/geocoding-api) for full documentation.
