/* eslint-env jest */
import nock from 'nock'
import { createConnector } from '../src'

describe('OpenWeather Connector', () => {
  const BASE = 'https://api.openweathermap.org'
  const API_KEY = 'test-api-key'

  describe('Current Weather', () => {
    it('should get weather by city name', async () => {
      const mockWeather = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        base: 'stations',
        main: {
          temp: 15.5,
          feels_like: 14.8,
          temp_min: 13.2,
          temp_max: 17.1,
          pressure: 1013,
          humidity: 72
        },
        visibility: 10000,
        wind: { speed: 3.6, deg: 250 },
        clouds: { all: 0 },
        dt: 1606435200,
        sys: { country: 'GB', sunrise: 1606462800, sunset: 1606494000 },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query({ q: 'London,uk', appid: API_KEY, units: 'metric' })
        .reply(200, mockWeather)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY, units: 'metric' })
      
      const weather = await conn.currentWeather.getByCity('London', 'uk')
      
      expect(weather.name).toBe('London')
      expect(weather.main.temp).toBe(15.5)
      expect(weather.weather[0].description).toBe('clear sky')
    })

    it('should get weather by coordinates', async () => {
      const mockWeather = {
        coord: { lon: 2.3522, lat: 48.8566 },
        weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
        main: { temp: 12.3, feels_like: 11.5, pressure: 1015, humidity: 65 },
        name: 'Paris',
        cod: 200
      }

      nock(BASE)
        .get('/data/2.5/weather')
        .query({ lat: 48.8566, lon: 2.3522, appid: API_KEY })
        .reply(200, mockWeather)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })
      
      const weather = await conn.currentWeather.getByCoordinates(48.8566, 2.3522)
      
      expect(weather.name).toBe('Paris')
      expect(weather.coord.lat).toBe(48.8566)
    })
  })

  describe('Weather Forecast', () => {
    it('should get 5-day forecast', async () => {
      const mockForecast = {
        cod: '200',
        message: 0,
        cnt: 40,
        list: [
          {
            dt: 1606435200,
            main: { temp: 15.5, feels_like: 14.8, pressure: 1013, humidity: 72 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 3.6, deg: 250 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
            dt_txt: '2020-11-27 00:00:00'
          }
        ],
        city: {
          id: 2643743,
          name: 'London',
          coord: { lat: 51.5085, lon: -0.1257 },
          country: 'GB',
          population: 1000000,
          timezone: 0,
          sunrise: 1606462800,
          sunset: 1606494000
        }
      }

      nock(BASE)
        .get('/data/2.5/forecast')
        .query({ q: 'London,uk', appid: API_KEY })
        .reply(200, mockForecast)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })
      
      const forecast = await conn.forecast.getByCity('London', 'uk')
      
      expect(forecast.city.name).toBe('London')
      expect(forecast.list.length).toBe(1)
      expect(forecast.list[0].main.temp).toBe(15.5)
    })
  })

  describe('Air Pollution', () => {
    it('should get current air pollution', async () => {
      const mockPollution = {
        coord: { lon: -0.1257, lat: 51.5085 },
        list: [
          {
            dt: 1606435200,
            main: { aqi: 2 },
            components: {
              co: 230.31,
              no: 0.01,
              no2: 13.12,
              o3: 60.32,
              so2: 0.64,
              pm2_5: 5.23,
              pm10: 6.45,
              nh3: 0.37
            }
          }
        ]
      }

      nock(BASE)
        .get('/data/2.5/air_pollution')
        .query({ lat: 51.5085, lon: -0.1257, appid: API_KEY })
        .reply(200, mockPollution)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })
      
      const pollution = await conn.airPollution.getCurrent(51.5085, -0.1257)
      
      expect(pollution.list[0].main.aqi).toBe(2)
      expect(pollution.list[0].components.pm2_5).toBe(5.23)
    })
  })

  describe('Geocoding', () => {
    it('should perform direct geocoding', async () => {
      const mockLocations = [
        {
          name: 'London',
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB'
        }
      ]

      nock(BASE)
        .get('/geo/1.0/direct')
        .query({ q: 'London,UK', limit: 1, appid: API_KEY })
        .reply(200, mockLocations)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })
      
      const locations = await conn.geocoding.direct('London,UK', 1)
      
      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
      expect(locations[0].country).toBe('GB')
    })

    it('should perform reverse geocoding', async () => {
      const mockLocations = [
        {
          name: 'London',
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB'
        }
      ]

      nock(BASE)
        .get('/geo/1.0/reverse')
        .query({ lat: 51.5085, lon: -0.1257, appid: API_KEY })
        .reply(200, mockLocations)

      const conn = createConnector()
      conn.init({ apiKey: API_KEY })
      
      const locations = await conn.geocoding.reverse(51.5085, -0.1257)
      
      expect(locations.length).toBe(1)
      expect(locations[0].name).toBe('London')
    })
  })
})
