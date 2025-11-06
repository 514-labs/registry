# Geocoding

Geocoding API allows getting geographical coordinates (lat, lon) by location name and vice versa (reverse geocoding).

## Description

The Geocoding API is a simple tool to get location coordinates by using the name of the location. It also provides reverse geocoding - getting the name of a location by geographical coordinates.

## Endpoints

### Direct Geocoding (by location name)
```
GET http://api.openweathermap.org/geo/1.0/direct
```

### Reverse Geocoding (by coordinates)
```
GET http://api.openweathermap.org/geo/1.0/reverse
```

### By Zip/Post Code
```
GET http://api.openweathermap.org/geo/1.0/zip
```

## Query Parameters

### Direct Geocoding
- `q` - City name, state code (only for US), country code (required)
- `limit` - Number of locations in response (optional, max 5)

### Reverse Geocoding
- `lat` - Latitude (required)
- `lon` - Longitude (required)
- `limit` - Number of locations in response (optional, max 5)

### By Zip Code
- `zip` - Zip/post code and country code divided by comma (required)

## Common Queries

Direct geocoding:
```
q=London,GB&limit=5
```

Reverse geocoding:
```
lat=51.5085&lon=-0.1257&limit=5
```

By zip code:
```
zip=E14,GB
```

## Response Fields

- `name` - Name of the found location
- `local_names` - Name in different languages (object with language codes as keys)
- `lat` - Latitude of the found location
- `lon` - Longitude of the found location
- `country` - Country of the found location (ISO 3166 country code)
- `state` - State of the found location (where available)

## Example Response (Direct Geocoding)

```json
[
  {
    "name": "London",
    "local_names": {
      "en": "London",
      "fr": "Londres",
      "de": "London",
      "es": "Londres"
    },
    "lat": 51.5085,
    "lon": -0.1257,
    "country": "GB"
  }
]
```

## Example Response (Zip Code)

```json
{
  "zip": "E14",
  "name": "London",
  "lat": 51.5085,
  "lon": -0.1278,
  "country": "GB"
}
```
