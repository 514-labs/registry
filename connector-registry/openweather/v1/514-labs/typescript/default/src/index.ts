/**
 * OpenWeather API Connector
 * 
 * Access OpenWeather's weather data APIs including current weather,
 * forecasts, air pollution, and geocoding.
 * 
 * @example
 * ```typescript
 * import { createConnector } from '@workspace/connector-openweather'
 * 
 * const connector = createConnector()
 * connector.init({ apiKey: 'your-api-key' })
 * 
 * const weather = await connector.currentWeather.getByCity('London', 'uk')
 * console.log(weather.main.temp)
 * ```
 */
export { createConnector, Connector } from './client/connector'
export type { OpenWeatherConnectorConfig } from './client/connector'
export type { CurrentWeather, GetWeatherParams } from './resources/current-weather'
export type { WeatherForecast, ForecastItem, GetForecastParams } from './resources/forecast'
export type { AirPollution, AirPollutionItem, AirQualityComponents, GetAirPollutionParams, GetHistoricalAirPollutionParams } from './resources/air-pollution'
export type { Location, ZipCodeLocation, DirectGeocodingParams, ReverseGeocodingParams, ZipCodeGeocodingParams } from './resources/geocoding'
