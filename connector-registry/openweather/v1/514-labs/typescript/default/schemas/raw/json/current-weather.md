# Current Weather Data

Current weather data for any location worldwide.

## Description

Get current weather data for any location on Earth including over 200,000 cities. The data includes:
- Temperature (current, min, max, feels like)
- Atmospheric pressure
- Humidity
- Wind speed and direction
- Cloudiness
- Rain and snow volume
- Sunrise and sunset times

## Query Methods

Get weather by city name:
```
q=London,UK
```

Get weather by coordinates:
```
lat=51.5074&lon=-0.1278
```

Get weather by city ID:
```
id=2643743
```

Get weather by ZIP code:
```
zip=10001,US
```

## Units

- `units=standard` - Temperature in Kelvin (default)
- `units=metric` - Temperature in Celsius
- `units=imperial` - Temperature in Fahrenheit

## API Endpoint

```
GET /data/2.5/weather
```

## Rate Limits

Free tier: 60 calls/minute, 1,000,000 calls/month
