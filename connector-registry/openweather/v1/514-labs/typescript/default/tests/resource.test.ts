/* eslint-env jest */
import nock from 'nock'
import { createConnector } from '../src'

describe('OpenWeather Connector', () => {
  const BASE = 'https://api.openweathermap.org'
  const API_KEY = 'test_api_key'

  afterEach(() => {
    nock.cleanAll()
  })

  describe('Current Weather', () => {
    it('gets current weather by city name', async () => {
      const mockResponse = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: {
          temp: 15.5,
          feels_like: 14.8,
          temp_min: 14.2,
          temp_max: 16.7,
          pressure: 1013,
          humidity: 72,
        },
        visibility: 10000,
        wind: { speed: 3.6, deg: 230 },
        clouds: { all: 0 },
        dt: 1605182400,
        sys: {
          type: 2,
          id: 2019646,
          country: 'GB',
          sunrise: 1605163788,
          sunset: 1605197062,
        },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200,
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query(true) // Match any query params
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const weather = await connector.currentWeather.getByCity('London,UK')

      expect(weather.name).toBe('London')
      expect(weather.main.temp).toBe(15.5)
      expect(weather.weather[0].main).toBe('Clear')
    })

    it('gets current weather by coordinates', async () => {
      const mockResponse = {
        coord: { lon: -0.1278, lat: 51.5074 },
        weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
        main: { temp: 14.3, feels_like: 13.6, temp_min: 13, temp_max: 15, pressure: 1015, humidity: 70 },
        wind: { speed: 2.5, deg: 180 },
        clouds: { all: 20 },
        dt: 1605182400,
        sys: { country: 'GB', sunrise: 1605163788, sunset: 1605197062 },
        name: 'London',
        cod: 200,
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const weather = await connector.currentWeather.getByCoordinates(51.5074, -0.1278)

      expect(weather.name).toBe('London')
      expect(weather.main.temp).toBe(14.3)
    })

    it('gets current weather by ZIP code', async () => {
      const mockResponse = {
        coord: { lon: -73.9967, lat: 40.7484 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 18, feels_like: 17, temp_min: 16, temp_max: 20, pressure: 1010, humidity: 65 },
        wind: { speed: 4.1, deg: 250 },
        clouds: { all: 0 },
        dt: 1605182400,
        sys: { country: 'US', sunrise: 1605176000, sunset: 1605213000 },
        name: 'New York',
        cod: 200,
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const weather = await connector.currentWeather.getByZip('10001,US')

      expect(weather.name).toBe('New York')
      expect(weather.main.temp).toBe(18)
    })
  })

  describe('Forecast', () => {
    it('gets 5-day forecast by city name', async () => {
      const mockResponse = {
        cod: '200',
        message: 0,
        cnt: 40,
        list: [
          {
            dt: 1605182400,
            main: { temp: 15, feels_like: 14, temp_min: 14, temp_max: 16, pressure: 1013, humidity: 70 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 3, deg: 200 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
            dt_txt: '2020-11-12 12:00:00',
          },
        ],
        city: {
          id: 2643743,
          name: 'London',
          coord: { lat: 51.5085, lon: -0.1257 },
          country: 'GB',
          population: 1000000,
          timezone: 0,
          sunrise: 1605163788,
          sunset: 1605197062,
        },
      }

      nock(BASE)
        .get('/data/2.5/forecast')
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const forecast = await connector.forecast.getByCity('London,UK')

      expect(forecast.city.name).toBe('London')
      expect(forecast.cnt).toBe(40)
      expect(forecast.list.length).toBeGreaterThan(0)
      expect(forecast.list[0].main.temp).toBe(15)
    })
  })

  describe('Air Pollution', () => {
    it('gets current air pollution data', async () => {
      const mockResponse = {
        coord: { lon: 2.3522, lat: 48.8566 },
        list: [
          {
            main: { aqi: 2 },
            components: {
              co: 230.31,
              no: 0.27,
              no2: 18.96,
              o3: 71.66,
              so2: 3.73,
              pm2_5: 8.15,
              pm10: 11.32,
              nh3: 1.01,
            },
            dt: 1605182400,
          },
        ],
      }

      nock(BASE)
        .get('/data/2.5/air_pollution')
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const pollution = await connector.airPollution.getCurrent(48.8566, 2.3522)

      expect(pollution.list[0].main.aqi).toBe(2)
      expect(pollution.list[0].components.pm2_5).toBe(8.15)
    })

    it('gets air pollution forecast', async () => {
      const mockResponse = {
        coord: { lon: 2.3522, lat: 48.8566 },
        list: [
          {
            main: { aqi: 1 },
            components: {
              co: 210.5,
              no: 0.1,
              no2: 15.2,
              o3: 68.3,
              so2: 2.5,
              pm2_5: 6.8,
              pm10: 9.2,
              nh3: 0.8,
            },
            dt: 1605268800,
          },
        ],
      }

      nock(BASE)
        .get('/data/2.5/air_pollution/forecast')
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const forecast = await connector.airPollution.getForecast(48.8566, 2.3522)

      expect(forecast.list[0].main.aqi).toBe(1)
    })
  })

  describe('Geocoding', () => {
    it('performs forward geocoding', async () => {
      const mockResponse = [
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
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const locations = await connector.geocoding.forward('London,UK', 1)

      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
      expect(locations[0].country).toBe('GB')
      expect(locations[0].lat).toBe(51.5085)
      expect(locations[0].lon).toBe(-0.1257)
    })

    it('performs reverse geocoding', async () => {
      const mockResponse = [
        {
          name: 'London',
          local_names: { en: 'London' },
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB',
        },
      ]

      nock(BASE)
        .get('/geo/1.0/reverse')
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const locations = await connector.geocoding.reverse(51.5085, -0.1257, 1)

      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
    })

    it('gets location by ZIP code', async () => {
      const mockResponse = {
        zip: '10001',
        name: 'New York',
        lat: 40.7484,
        lon: -73.9967,
        country: 'US',
      }

      nock(BASE)
        .get('/geo/1.0/zip')
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY })

      const location = await connector.geocoding.byZipCode('10001,US')

      expect(location.name).toBe('New York')
      expect(location.zip).toBe('10001')
      expect(location.country).toBe('US')
    })
  })

  describe('Configuration', () => {
    it('applies default units configuration', async () => {
      const mockResponse = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 288.15, feels_like: 287.15, temp_min: 287, temp_max: 289, pressure: 1013, humidity: 72 },
        wind: { speed: 3.6, deg: 230 },
        clouds: { all: 0 },
        dt: 1605182400,
        sys: { country: 'GB', sunrise: 1605163788, sunset: 1605197062 },
        name: 'London',
        cod: 200,
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, mockResponse)

      const connector = createConnector()
      connector.init({ apiKey: API_KEY, units: 'metric' })

      const weather = await connector.currentWeather.getByCity('London')

      expect(weather.name).toBe('London')
    })
  })
})
