/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('OpenWeather Connector', () => {
  const BASE = 'https://api.openweathermap.org'
  const API_KEY = 'test-api-key'

  describe('Weather Resource', () => {
    it('gets current weather by city name', async () => {
      const mockWeather = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: {
          temp: 15.5,
          feels_like: 14.8,
          temp_min: 13.9,
          temp_max: 17.2,
          pressure: 1013,
          humidity: 72,
        },
        visibility: 10000,
        wind: { speed: 4.1, deg: 80 },
        clouds: { all: 0 },
        dt: 1605182400,
        sys: { country: 'GB', sunrise: 1605164800, sunset: 1605198000 },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200,
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query({ q: 'London,UK', appid: API_KEY, units: 'metric', lang: 'en' })
        .reply(200, mockWeather)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY, units: 'metric' })

      const weather = await connector.weather.get({ q: 'London,UK' })
      expect(weather.name).toBe('London')
      expect(weather.main.temp).toBe(15.5)
      expect(weather.coord.lat).toBe(51.5085)
    })

    it('gets current weather by coordinates', async () => {
      const mockWeather = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 15.5, feels_like: 14.8, temp_min: 13.9, temp_max: 17.2, pressure: 1013, humidity: 72 },
        wind: { speed: 4.1, deg: 80 },
        clouds: { all: 0 },
        dt: 1605182400,
        sys: { country: 'GB', sunrise: 1605164800, sunset: 1605198000 },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200,
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query({ lat: 51.5085, lon: -0.1257, appid: API_KEY, units: 'metric', lang: 'en' })
        .reply(200, mockWeather)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY, units: 'metric' })

      const weather = await connector.weather.get({ lat: 51.5085, lon: -0.1257 })
      expect(weather.name).toBe('London')
    })
  })

  describe('Forecast Resource', () => {
    it('gets 5-day forecast', async () => {
      const mockForecast = {
        cod: '200',
        message: 0,
        cnt: 2,
        list: [
          {
            dt: 1605182400,
            main: { temp: 15.5, feels_like: 14.8, temp_min: 13.9, temp_max: 17.2, pressure: 1013, humidity: 72 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 4.1, deg: 80 },
            visibility: 10000,
            pop: 0.2,
            sys: { pod: 'd' },
            dt_txt: '2024-11-06 12:00:00',
          },
          {
            dt: 1605193200,
            main: { temp: 14.2, feels_like: 13.5, temp_min: 12.8, temp_max: 15.6, pressure: 1014, humidity: 75 },
            weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
            clouds: { all: 20 },
            wind: { speed: 3.8, deg: 75 },
            visibility: 10000,
            pop: 0.1,
            sys: { pod: 'd' },
            dt_txt: '2024-11-06 15:00:00',
          },
        ],
        city: {
          id: 2643743,
          name: 'London',
          coord: { lat: 51.5085, lon: -0.1257 },
          country: 'GB',
          timezone: 0,
          sunrise: 1605164800,
          sunset: 1605198000,
        },
      }

      nock(BASE)
        .get('/data/2.5/forecast')
        .query({ q: 'London,UK', cnt: 2, appid: API_KEY, units: 'metric', lang: 'en' })
        .reply(200, mockForecast)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY, units: 'metric' })

      const forecast = await connector.forecast.get({ q: 'London,UK', cnt: 2 })
      expect(forecast.city.name).toBe('London')
      expect(forecast.cnt).toBe(2)
      expect(forecast.list.length).toBe(2)
    })
  })

  describe('Air Pollution Resource', () => {
    it('gets current air pollution data', async () => {
      const mockAirPollution = {
        coord: { lon: -0.1257, lat: 51.5085 },
        list: [
          {
            dt: 1605182400,
            main: { aqi: 2 },
            components: {
              co: 230.31,
              no: 0.21,
              no2: 13.82,
              o3: 68.66,
              so2: 1.73,
              pm2_5: 5.8,
              pm10: 7.0,
              nh3: 0.92,
            },
          },
        ],
      }

      nock(BASE)
        .get('/data/2.5/air_pollution')
        .query({ lat: 51.5085, lon: -0.1257, appid: API_KEY, units: 'metric', lang: 'en' })
        .reply(200, mockAirPollution)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY, units: 'metric' })

      const airPollution = await connector.airPollution.getCurrent({ lat: 51.5085, lon: -0.1257 })
      expect(airPollution.list[0].main.aqi).toBe(2)
      expect(airPollution.list[0].components.co).toBe(230.31)
    })
  })

  describe('Geocoding Resource', () => {
    it('gets coordinates by location name', async () => {
      const mockGeocode = [
        {
          name: 'London',
          local_names: { en: 'London' },
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB',
        },
      ]

      nock(BASE)
        .get('/geo/1.0/direct')
        .query({ q: 'London,UK', limit: 1, appid: API_KEY, units: 'metric', lang: 'en' })
        .reply(200, mockGeocode)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY, units: 'metric' })

      const locations = await connector.geocoding.getByLocationName({ q: 'London,UK', limit: 1 })
      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
      expect(locations[0].lat).toBe(51.5085)
    })

    it('gets location by coordinates (reverse geocoding)', async () => {
      const mockReverseGeocode = [
        {
          name: 'London',
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB',
        },
      ]

      nock(BASE)
        .get('/geo/1.0/reverse')
        .query({ lat: 51.5085, lon: -0.1257, limit: 1, appid: API_KEY, units: 'metric', lang: 'en' })
        .reply(200, mockReverseGeocode)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY, units: 'metric' })

      const locations = await connector.geocoding.getByCoordinates({ lat: 51.5085, lon: -0.1257, limit: 1 })
      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
    })
  })
})
