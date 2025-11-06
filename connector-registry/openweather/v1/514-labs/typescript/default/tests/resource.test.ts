/* eslint-env jest */
import nock from 'nock'
import { createConnector } from '../src'

describe('OpenWeather Connector', () => {
  const BASE = 'https://api.openweathermap.org'
  const API_KEY = 'test-api-key'

  afterEach(() => {
    nock.cleanAll()
  })

  describe('Current Weather', () => {
    it('should get current weather by city name', async () => {
      const mockWeather = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: {
          temp: 15.5,
          feels_like: 14.8,
          temp_min: 14.2,
          temp_max: 16.8,
          pressure: 1013,
          humidity: 72,
        },
        visibility: 10000,
        wind: { speed: 3.6, deg: 220 },
        clouds: { all: 0 },
        dt: 1234567890,
        sys: {
          type: 2,
          id: 2019646,
          country: 'GB',
          sunrise: 1234560000,
          sunset: 1234600000,
        },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200,
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query({ q: 'London,GB', units: 'metric', appid: API_KEY })
        .reply(200, mockWeather)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const weather = await conn.weather.get({
        q: 'London,GB',
        units: 'metric',
      })

      expect(weather.name).toBe('London')
      expect(weather.main.temp).toBe(15.5)
      expect(weather.weather[0].main).toBe('Clear')
    })

    it('should get current weather by coordinates', async () => {
      const mockWeather = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: { temp: 15.5, feels_like: 14.8, temp_min: 14.2, temp_max: 16.8, pressure: 1013, humidity: 72 },
        visibility: 10000,
        wind: { speed: 3.6, deg: 220 },
        clouds: { all: 0 },
        dt: 1234567890,
        sys: { type: 2, id: 2019646, country: 'GB', sunrise: 1234560000, sunset: 1234600000 },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200,
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query({ lat: 51.5085, lon: -0.1257, appid: API_KEY })
        .reply(200, mockWeather)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const weather = await conn.weather.get({
        lat: 51.5085,
        lon: -0.1257,
      })

      expect(weather.name).toBe('London')
      expect(weather.coord.lat).toBe(51.5085)
    })
  })

  describe('Forecast', () => {
    it('should get 5-day forecast', async () => {
      const mockForecast = {
        cod: '200',
        message: 0,
        cnt: 2,
        list: [
          {
            dt: 1234567890,
            main: { temp: 15.5, feels_like: 14.8, temp_min: 14.2, temp_max: 16.8, pressure: 1013, sea_level: 1013, grnd_level: 1010, humidity: 72, temp_kf: 0 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 3.6, deg: 220 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
            dt_txt: '2023-01-01 12:00:00',
          },
          {
            dt: 1234578890,
            main: { temp: 14.2, feels_like: 13.5, temp_min: 13.0, temp_max: 15.0, pressure: 1012, sea_level: 1012, grnd_level: 1009, humidity: 75, temp_kf: 0 },
            weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
            clouds: { all: 20 },
            wind: { speed: 4.1, deg: 230 },
            visibility: 10000,
            pop: 0.1,
            sys: { pod: 'd' },
            dt_txt: '2023-01-01 15:00:00',
          },
        ],
        city: {
          id: 2643743,
          name: 'London',
          coord: { lat: 51.5085, lon: -0.1257 },
          country: 'GB',
          population: 1000000,
          timezone: 0,
          sunrise: 1234560000,
          sunset: 1234600000,
        },
      }

      nock(BASE)
        .get('/data/2.5/forecast')
        .query({ q: 'London,GB', units: 'metric', cnt: 2, appid: API_KEY })
        .reply(200, mockForecast)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const forecast = await conn.forecast.get({
        q: 'London,GB',
        units: 'metric',
        cnt: 2,
      })

      expect(forecast.city.name).toBe('London')
      expect(forecast.list.length).toBe(2)
      expect(forecast.list[0].main.temp).toBe(15.5)
    })
  })

  describe('Air Pollution', () => {
    it('should get current air pollution', async () => {
      const mockPollution = {
        coord: { lon: -0.1257, lat: 51.5085 },
        list: [
          {
            main: { aqi: 2 },
            components: {
              co: 230.3,
              no: 0.1,
              no2: 15.2,
              o3: 60.5,
              so2: 2.1,
              pm2_5: 8.5,
              pm10: 12.3,
              nh3: 1.2,
            },
            dt: 1234567890,
          },
        ],
      }

      nock(BASE)
        .get('/data/2.5/air_pollution')
        .query({ lat: 51.5085, lon: -0.1257, appid: API_KEY })
        .reply(200, mockPollution)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const pollution = await conn.airPollution.getCurrent({
        lat: 51.5085,
        lon: -0.1257,
      })

      expect(pollution.list[0].main.aqi).toBe(2)
      expect(pollution.list[0].components.pm2_5).toBe(8.5)
    })
  })

  describe('Geocoding', () => {
    it('should get location by name', async () => {
      const mockLocations = [
        {
          name: 'London',
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB',
        },
      ]

      nock(BASE)
        .get('/geo/1.0/direct')
        .query({ q: 'London,GB', limit: 1, appid: API_KEY })
        .reply(200, mockLocations)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const locations = await conn.geocoding.getByLocationName({
        q: 'London,GB',
        limit: 1,
      })

      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
      expect(locations[0].country).toBe('GB')
    })

    it('should get location by coordinates', async () => {
      const mockLocations = [
        {
          name: 'London',
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB',
        },
      ]

      nock(BASE)
        .get('/geo/1.0/reverse')
        .query({ lat: 51.5085, lon: -0.1257, limit: 1, appid: API_KEY })
        .reply(200, mockLocations)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const locations = await conn.geocoding.getByCoordinates({
        lat: 51.5085,
        lon: -0.1257,
        limit: 1,
      })

      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
    })

    it('should get location by zip code', async () => {
      const mockLocation = {
        zip: 'E14',
        name: 'London',
        lat: 51.5085,
        lon: -0.1257,
        country: 'GB',
      }

      nock(BASE)
        .get('/geo/1.0/zip')
        .query({ zip: 'E14,GB', appid: API_KEY })
        .reply(200, mockLocation)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const location = await conn.geocoding.getByZipCode({
        zip: 'E14,GB',
      })

      expect(location.name).toBe('London')
      expect(location.zip).toBe('E14')
    })
  })
})
