// Main connector export
export * from './client/connector'

// Resource types
export type { CurrentWeather, WeatherQueryParams } from './resources/weather'
export type { ForecastItem, ForecastResponse, ForecastQueryParams } from './resources/forecast'
export type { AirPollutionData, AirPollutionResponse, AirPollutionQueryParams } from './resources/air-pollution'
export type { GeocodingLocation, DirectGeocodingQueryParams, ReverseGeocodingQueryParams, ZipGeocodingQueryParams } from './resources/geocoding'
