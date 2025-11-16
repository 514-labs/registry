# Current Weather Data

Current weather data for any location on Earth including over 200,000 cities.

## Description

Access current weather data for any location including over 200,000 cities. Current weather is frequently updated based on global models and data from more than 40,000 weather stations.

## API Endpoint

```
GET /data/2.5/weather
```

## Query Parameters

You must provide one of the following to identify the location:

- `q`: City name, state code (US only) and country code divided by comma (e.g., "London,uk")
- `lat` & `lon`: Geographic coordinates (latitude and longitude)
- `id`: City ID
- `zip`: Zip/post code and country code divided by comma (e.g., "94040,us")

Additional parameters:
- `units`: Units of measurement (standard, metric, imperial)
- `lang`: Language for weather description

## Common Use Cases

**Get weather for a specific city:**
```
q=London,uk
```

**Get weather by coordinates:**
```
lat=51.5074&lon=-0.1278
```

**Get weather with metric units:**
```
q=Paris&units=metric
```

## Response Fields

- `coord`: Geographic coordinates (longitude, latitude)
- `weather`: Weather condition codes and descriptions
- `main`: Main weather parameters (temperature, pressure, humidity)
- `wind`: Wind parameters (speed, direction, gust)
- `clouds`: Cloudiness percentage
- `rain`: Rain volume for last 1 or 3 hours
- `snow`: Snow volume for last 1 or 3 hours
- `dt`: Time of data calculation (Unix timestamp)
- `sys`: System data including country, sunrise, and sunset times
- `name`: City name

## Units

### Temperature
- **Standard**: Kelvin
- **Metric**: Celsius
- **Imperial**: Fahrenheit

### Wind Speed
- **Standard/Metric**: meter/sec
- **Imperial**: miles/hour

### Pressure
- hPa (hectopascals)

## Rate Limits

Free tier: 60 calls/minute

## Documentation

https://openweathermap.org/current
