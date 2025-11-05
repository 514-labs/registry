// Export types only, not the createResource functions to avoid conflicts
export type { 
  Coordinates, 
  Weather, 
  MainWeatherData, 
  Wind, 
  Clouds, 
  Rain, 
  Snow, 
  Sys, 
  CurrentWeatherResponse, 
  CurrentWeatherParams 
} from './current-weather'

export type { 
  ForecastItem, 
  City, 
  ForecastResponse, 
  ForecastParams 
} from './forecast'

export type { 
  AirQualityComponents, 
  AirQualityData, 
  AirPollutionResponse, 
  AirPollutionParams 
} from './air-pollution'

export type { 
  GeocodingLocation, 
  ReverseGeocodingLocation, 
  GeocodingParams, 
  ReverseGeocodingParams, 
  ZipCodeLocation 
} from './geocoding'
