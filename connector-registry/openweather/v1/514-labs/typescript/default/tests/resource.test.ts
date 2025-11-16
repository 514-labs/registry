/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('OpenWeather Connector', () => {
  const BASE = 'https://api.openweathermap.org'
  const API_KEY = 'test-api-key'

  afterEach(() => {
    nock.cleanAll()
  })

  describe('weather resource', () => {
    it('gets current weather by city name', async () => {
      const mockResponse = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: { temp: 15, feels_like: 14, temp_min: 13, temp_max: 17, pressure: 1013, humidity: 72 },
        visibility: 10000,
        wind: { speed: 3.6, deg: 230 },
        clouds: { all: 0 },
        dt: 1605182400,
        sys: { type: 1, id: 1414, country: 'GB', sunrise: 1605168123, sunset: 1605201456 },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query({ q: 'London,UK', units: 'metric', appid: API_KEY })
        .reply(200, mockResponse)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const weather = await conn.weather.getCurrent({ q: 'London,UK', units: 'metric' })
      
      expect(weather.name).toBe('London')
      expect(weather.main.temp).toBe(15)
      expect(weather.weather[0].main).toBe('Clear')
    })

    it('gets current weather by coordinates', async () => {
      const mockResponse = {
        coord: { lon: -0.1278, lat: 51.5074 },
        weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
        main: { temp: 16, feels_like: 15, temp_min: 14, temp_max: 18, pressure: 1015, humidity: 65 },
        name: 'London',
        cod: 200
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query({ lat: 51.5074, lon: -0.1278, appid: API_KEY })
        .reply(200, mockResponse)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const weather = await conn.weather.getCurrent({ lat: 51.5074, lon: -0.1278 })
      
      expect(weather.name).toBe('London')
      expect(weather.main.temp).toBe(16)
    })

    it('gets weather for multiple cities', async () => {
      const mockResponse = {
        cnt: 2,
        list: [
          { id: 2643743, name: 'London', main: { temp: 15 } },
          { id: 5368361, name: 'Los Angeles', main: { temp: 22 } }
        ]
      }

      nock(BASE)
        .get('/data/2.5/group')
        .query({ id: '2643743,5368361', units: 'metric', appid: API_KEY })
        .reply(200, mockResponse)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const data = await conn.weather.getMultipleCities([2643743, 5368361], { units: 'metric' })
      
      expect(data.cnt).toBe(2)
      expect(data.list).toHaveLength(2)
      expect(data.list[0].name).toBe('London')
    })
  })

  describe('forecast resource', () => {
    it('gets 5-day forecast', async () => {
      const mockResponse = {
        cod: '200',
        message: 0,
        cnt: 2,
        list: [
          {
            dt: 1605189600,
            main: { temp: 15, feels_like: 14, temp_min: 15, temp_max: 16, pressure: 1013, humidity: 72, temp_kf: 0 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 3.6, deg: 230 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
            dt_txt: '2020-11-12 12:00:00'
          },
          {
            dt: 1605200400,
            main: { temp: 14, feels_like: 13, temp_min: 14, temp_max: 14, pressure: 1014, humidity: 75, temp_kf: 0 },
            weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02n' }],
            clouds: { all: 20 },
            wind: { speed: 3.1, deg: 240 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'n' },
            dt_txt: '2020-11-12 15:00:00'
          }
        ],
        city: {
          id: 2643743,
          name: 'London',
          coord: { lat: 51.5085, lon: -0.1257 },
          country: 'GB',
          population: 1000000,
          timezone: 0,
          sunrise: 1605168123,
          sunset: 1605201456
        }
      }

      nock(BASE)
        .get('/data/2.5/forecast')
        .query({ q: 'London,UK', cnt: 2, appid: API_KEY })
        .reply(200, mockResponse)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const forecast = await conn.forecast.get5Day3Hour({ q: 'London,UK', cnt: 2 })
      
      expect(forecast.cnt).toBe(2)
      expect(forecast.list).toHaveLength(2)
      expect(forecast.city.name).toBe('London')
      expect(forecast.list[0].main.temp).toBe(15)
    })
  })

  describe('air pollution resource', () => {
    it('gets current air pollution', async () => {
      const mockResponse = {
        coord: { lon: -0.1278, lat: 51.5074 },
        list: [{
          dt: 1605182400,
          main: { aqi: 2 },
          components: {
            co: 230.31,
            no: 0.21,
            no2: 12.34,
            o3: 56.78,
            so2: 5.67,
            pm2_5: 8.9,
            pm10: 12.3,
            nh3: 0.45
          }
        }]
      }

      nock(BASE)
        .get('/data/2.5/air_pollution')
        .query({ lat: 51.5074, lon: -0.1278, appid: API_KEY })
        .reply(200, mockResponse)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const pollution = await conn.airPollution.getCurrent({ lat: 51.5074, lon: -0.1278 })
      
      expect(pollution.list).toHaveLength(1)
      expect(pollution.list[0].main.aqi).toBe(2)
      expect(pollution.list[0].components.pm2_5).toBe(8.9)
    })
  })

  describe('geocoding resource', () => {
    it('gets coordinates by location name', async () => {
      const mockResponse = [
        {
          name: 'London',
          local_names: { en: 'London' },
          lat: 51.5074,
          lon: -0.1278,
          country: 'GB',
          state: 'England'
        }
      ]

      nock(BASE)
        .get('/geo/1.0/direct')
        .query({ q: 'London', limit: 1, appid: API_KEY })
        .reply(200, mockResponse)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const locations = await conn.geocoding.getByLocationName({ q: 'London', limit: 1 })
      
      expect(locations).toHaveLength(1)
      expect(locations[0].name).toBe('London')
      expect(locations[0].country).toBe('GB')
      expect(locations[0].lat).toBe(51.5074)
    })

    it('gets location by coordinates (reverse geocoding)', async () => {
      const mockResponse = [
        {
          name: 'London',
          lat: 51.5074,
          lon: -0.1278,
          country: 'GB'
        }
      ]

      nock(BASE)
        .get('/geo/1.0/reverse')
        .query({ lat: 51.5074, lon: -0.1278, limit: 1, appid: API_KEY })
        .reply(200, mockResponse)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const locations = await conn.geocoding.getByCoordinates({ lat: 51.5074, lon: -0.1278, limit: 1 })
      
      expect(locations).toHaveLength(1)
      expect(locations[0].name).toBe('London')
    })

    it('gets location by ZIP code', async () => {
      const mockResponse = {
        zip: '94040',
        name: 'Mountain View',
        lat: 37.3861,
        lon: -122.0839,
        country: 'US'
      }

      nock(BASE)
        .get('/geo/1.0/zip')
        .query({ zip: '94040,US', appid: API_KEY })
        .reply(200, mockResponse)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })

      const location = await conn.geocoding.getByZipCode({ zip: '94040,US' })
      
      expect(location.name).toBe('Mountain View')
      expect(location.country).toBe('US')
      expect(location.lat).toBe(37.3861)
    })
  })
})
