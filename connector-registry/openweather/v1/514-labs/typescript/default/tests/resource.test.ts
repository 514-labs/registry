/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

const BASE = 'https://api.openweathermap.org'

describe('Weather Resource', () => {
  it('fetches current weather by city name', async () => {
    const mockWeather = {
      coord: { lon: -0.1257, lat: 51.5085 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      base: 'stations',
      main: { temp: 15, feels_like: 14, temp_min: 13, temp_max: 17, pressure: 1013, humidity: 72 },
      visibility: 10000,
      wind: { speed: 3.5, deg: 230 },
      clouds: { all: 0 },
      dt: 1606223802,
      sys: { type: 1, id: 1414, country: 'GB', sunrise: 1606203982, sunset: 1606233982 },
      timezone: 0,
      id: 2643743,
      name: 'London',
      cod: 200
    }

    nock(BASE)
      .get('/data/2.5/weather')
      .query({ q: 'London,UK', appid: 'test-key', units: 'metric' })
      .reply(200, mockWeather)

    const conn = createConnector()
    conn.init({ apiKey: 'test-key', units: 'metric' })

    const weather = await conn.weather.get({ q: 'London,UK' })
    expect(weather.name).toBe('London')
    expect(weather.sys.country).toBe('GB')
    expect(weather.main.temp).toBe(15)
  })

  it('fetches current weather by coordinates', async () => {
    const mockWeather = {
      coord: { lon: -0.1257, lat: 51.5085 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 15, feels_like: 14, temp_min: 13, temp_max: 17, pressure: 1013, humidity: 72 },
      name: 'London',
      cod: 200
    }

    nock(BASE)
      .get('/data/2.5/weather')
      .query({ lat: 51.5085, lon: -0.1257, appid: 'test-key', units: 'metric' })
      .reply(200, mockWeather)

    const conn = createConnector()
    conn.init({ apiKey: 'test-key', units: 'metric' })

    const weather = await conn.weather.get({ lat: 51.5085, lon: -0.1257 })
    expect(weather.name).toBe('London')
  })
})

describe('Forecast Resource', () => {
  it('fetches 5-day forecast', async () => {
    const mockForecast = {
      cod: '200',
      message: 0,
      cnt: 3,
      list: [
        { dt: 1606223802, main: { temp: 15 }, weather: [{ main: 'Clear' }], dt_txt: '2020-11-24 12:00:00' },
        { dt: 1606234602, main: { temp: 14 }, weather: [{ main: 'Clouds' }], dt_txt: '2020-11-24 15:00:00' },
        { dt: 1606245402, main: { temp: 13 }, weather: [{ main: 'Rain' }], dt_txt: '2020-11-24 18:00:00' }
      ],
      city: { id: 2643743, name: 'London', country: 'GB' }
    }

    nock(BASE)
      .get('/data/2.5/forecast')
      .query({ q: 'London,UK', cnt: 3, appid: 'test-key', units: 'metric' })
      .reply(200, mockForecast)

    const conn = createConnector()
    conn.init({ apiKey: 'test-key', units: 'metric' })

    const forecast = await conn.forecast.get({ q: 'London,UK', cnt: 3 })
    expect(forecast.city.name).toBe('London')
    expect(forecast.cnt).toBe(3)
    expect(forecast.list.length).toBe(3)
  })
})

describe('Air Pollution Resource', () => {
  it('fetches current air pollution', async () => {
    const mockPollution = {
      coord: { lon: -0.1257, lat: 51.5085 },
      list: [
        {
          main: { aqi: 2 },
          components: { co: 230.31, no: 0.58, no2: 19.53, o3: 68.66, so2: 0.43, pm2_5: 8.31, pm10: 12.01, nh3: 0.52 },
          dt: 1606223802
        }
      ]
    }

    nock(BASE)
      .get('/data/2.5/air_pollution')
      .query({ lat: 51.5085, lon: -0.1257, appid: 'test-key', units: 'metric' })
      .reply(200, mockPollution)

    const conn = createConnector()
    conn.init({ apiKey: 'test-key', units: 'metric' })

    const pollution = await conn.airPollution.getCurrent({ lat: 51.5085, lon: -0.1257 })
    expect(pollution.list[0].main.aqi).toBe(2)
    expect(pollution.list[0].components.pm2_5).toBe(8.31)
  })
})

describe('Geocoding Resource', () => {
  it('fetches locations by direct geocoding', async () => {
    const mockLocations = [
      { name: 'London', lat: 51.5085, lon: -0.1257, country: 'GB' },
      { name: 'London', lat: 42.9834, lon: -81.233, country: 'CA', state: 'Ontario' }
    ]

    nock(BASE)
      .get('/geo/1.0/direct')
      .query({ q: 'London', limit: 2, appid: 'test-key', units: 'metric' })
      .reply(200, mockLocations)

    const conn = createConnector()
    conn.init({ apiKey: 'test-key', units: 'metric' })

    const locations = await conn.geocoding.direct({ q: 'London', limit: 2 })
    expect(locations.length).toBe(2)
    expect(locations[0].name).toBe('London')
    expect(locations[0].country).toBe('GB')
  })

  it('fetches locations by reverse geocoding', async () => {
    const mockLocations = [
      { name: 'London', lat: 51.5085, lon: -0.1257, country: 'GB' }
    ]

    nock(BASE)
      .get('/geo/1.0/reverse')
      .query({ lat: 51.5085, lon: -0.1257, appid: 'test-key', units: 'metric' })
      .reply(200, mockLocations)

    const conn = createConnector()
    conn.init({ apiKey: 'test-key', units: 'metric' })

    const locations = await conn.geocoding.reverse({ lat: 51.5085, lon: -0.1257 })
    expect(locations.length).toBe(1)
    expect(locations[0].name).toBe('London')
  })
})

