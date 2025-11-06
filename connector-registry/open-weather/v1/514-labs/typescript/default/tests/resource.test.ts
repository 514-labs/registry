/* eslint-env jest */
import nock from 'nock'
import { createConnector } from '../src'

const BASE_URL = 'https://api.openweathermap.org'
const TEST_API_KEY = 'test-api-key'

describe('OpenWeather Connector', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('weather resource', () => {
    it('gets current weather by city name', async () => {
      const mockWeather = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: {
          temp: 15.0,
          feels_like: 14.5,
          temp_min: 13.0,
          temp_max: 17.0,
          pressure: 1013,
          humidity: 72
        },
        visibility: 10000,
        wind: { speed: 4.5, deg: 230 },
        clouds: { all: 0 },
        dt: 1635000000,
        sys: { type: 2, id: 2019646, country: 'GB', sunrise: 1634976123, sunset: 1635013456 },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200
      }

      nock(BASE_URL)
        .get('/data/2.5/weather')
        .query({ q: 'London,UK', units: 'metric', lang: 'en', appid: TEST_API_KEY })
        .reply(200, mockWeather)

      const conn = createConnector()
      conn.init({ apiKey: TEST_API_KEY, units: 'metric' })
      const weather = await conn.weather.getCurrent({ q: 'London,UK' })

      expect(weather.name).toBe('London')
      expect(weather.main.temp).toBe(15.0)
      expect(weather.weather[0].main).toBe('Clear')
    })

    it('gets current weather by coordinates', async () => {
      const mockWeather = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: { temp: 15.0, feels_like: 14.5, temp_min: 13.0, temp_max: 17.0, pressure: 1013, humidity: 72 },
        visibility: 10000,
        wind: { speed: 4.5, deg: 230 },
        clouds: { all: 0 },
        dt: 1635000000,
        sys: { type: 2, id: 2019646, country: 'GB', sunrise: 1634976123, sunset: 1635013456 },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200
      }

      nock(BASE_URL)
        .get('/data/2.5/weather')
        .query({ lat: 51.5085, lon: -0.1257, units: 'metric', lang: 'en', appid: TEST_API_KEY })
        .reply(200, mockWeather)

      const conn = createConnector()
      conn.init({ apiKey: TEST_API_KEY, units: 'metric' })
      const weather = await conn.weather.getCurrent({ lat: 51.5085, lon: -0.1257 })

      expect(weather.name).toBe('London')
    })
  })

  describe('forecast resource', () => {
    it('gets 5-day forecast', async () => {
      const mockForecast = {
        cod: '200',
        message: 0,
        cnt: 2,
        list: [
          {
            dt: 1635000000,
            main: { temp: 15.0, feels_like: 14.5, temp_min: 13.0, temp_max: 17.0, pressure: 1013, humidity: 72 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 4.5, deg: 230 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
            dt_txt: '2021-10-23 12:00:00'
          },
          {
            dt: 1635010800,
            main: { temp: 16.0, feels_like: 15.5, temp_min: 14.0, temp_max: 18.0, pressure: 1014, humidity: 68 },
            weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
            clouds: { all: 20 },
            wind: { speed: 5.0, deg: 240 },
            visibility: 10000,
            pop: 0.1,
            sys: { pod: 'd' },
            dt_txt: '2021-10-23 15:00:00'
          }
        ],
        city: {
          id: 2643743,
          name: 'London',
          coord: { lat: 51.5085, lon: -0.1257 },
          country: 'GB',
          population: 1000000,
          timezone: 0,
          sunrise: 1634976123,
          sunset: 1635013456
        }
      }

      nock(BASE_URL)
        .get('/data/2.5/forecast')
        .query({ q: 'London,UK', cnt: 2, units: 'metric', lang: 'en', appid: TEST_API_KEY })
        .reply(200, mockForecast)

      const conn = createConnector()
      conn.init({ apiKey: TEST_API_KEY, units: 'metric' })
      const forecast = await conn.forecast.get5Day({ q: 'London,UK', cnt: 2 })

      expect(forecast.city.name).toBe('London')
      expect(forecast.list.length).toBe(2)
      expect(forecast.list[0].main.temp).toBe(15.0)
    })
  })

  describe('geocoding resource', () => {
    it('performs direct geocoding', async () => {
      const mockLocations = [
        {
          name: 'London',
          local_names: { en: 'London' },
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB',
          state: 'England'
        }
      ]

      nock(BASE_URL)
        .get('/geo/1.0/direct')
        .query({ q: 'London,UK', limit: 1, appid: TEST_API_KEY })
        .reply(200, mockLocations)

      const conn = createConnector()
      conn.init({ apiKey: TEST_API_KEY })
      const locations = await conn.geocoding.direct({ q: 'London,UK', limit: 1 })

      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
      expect(locations[0].lat).toBe(51.5085)
    })

    it('performs reverse geocoding', async () => {
      const mockLocations = [
        {
          name: 'London',
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB'
        }
      ]

      nock(BASE_URL)
        .get('/geo/1.0/reverse')
        .query({ lat: 51.5085, lon: -0.1257, appid: TEST_API_KEY })
        .reply(200, mockLocations)

      const conn = createConnector()
      conn.init({ apiKey: TEST_API_KEY })
      const locations = await conn.geocoding.reverse({ lat: 51.5085, lon: -0.1257 })

      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
    })
  })

  describe('air pollution resource', () => {
    it('gets current air pollution', async () => {
      const mockAirPollution = {
        coord: { lon: -0.1257, lat: 51.5085 },
        list: [
          {
            dt: 1635000000,
            main: { aqi: 2 },
            components: {
              co: 230.31,
              no: 0.01,
              no2: 14.87,
              o3: 68.66,
              so2: 0.64,
              pm2_5: 5.23,
              pm10: 7.01,
              nh3: 0.82
            }
          }
        ]
      }

      nock(BASE_URL)
        .get('/data/2.5/air_pollution')
        .query({ lat: 51.5085, lon: -0.1257, appid: TEST_API_KEY })
        .reply(200, mockAirPollution)

      const conn = createConnector()
      conn.init({ apiKey: TEST_API_KEY })
      const airPollution = await conn.airPollution.getCurrent({ lat: 51.5085, lon: -0.1257 })

      expect(airPollution.list.length).toBe(1)
      expect(airPollution.list[0].main.aqi).toBe(2)
      expect(airPollution.list[0].components.pm2_5).toBe(5.23)
    })

    it('gets air pollution forecast', async () => {
      const mockAirPollution = {
        coord: { lon: -0.1257, lat: 51.5085 },
        list: [
          {
            dt: 1635000000,
            main: { aqi: 2 },
            components: {
              co: 230.31,
              no: 0.01,
              no2: 14.87,
              o3: 68.66,
              so2: 0.64,
              pm2_5: 5.23,
              pm10: 7.01,
              nh3: 0.82
            }
          }
        ]
      }

      nock(BASE_URL)
        .get('/data/2.5/air_pollution/forecast')
        .query({ lat: 51.5085, lon: -0.1257, appid: TEST_API_KEY })
        .reply(200, mockAirPollution)

      const conn = createConnector()
      conn.init({ apiKey: TEST_API_KEY })
      const forecast = await conn.airPollution.getForecast({ lat: 51.5085, lon: -0.1257 })

      expect(forecast.list.length).toBe(1)
      expect(forecast.list[0].main.aqi).toBe(2)
    })
  })
})

