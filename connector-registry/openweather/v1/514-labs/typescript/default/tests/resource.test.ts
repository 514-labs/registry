/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('OpenWeather Connector', () => {
  const BASE_URL = 'https://api.openweathermap.org'
  const API_KEY = 'test-api-key'

  afterEach(() => {
    nock.cleanAll()
  })

  it('gets current weather by city name', async () => {
    nock(BASE_URL)
      .get('/data/2.5/weather')
      .query({ q: 'London', appid: API_KEY })
      .reply(200, {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 289.15, feels_like: 288.5, temp_min: 287.15, temp_max: 291.15, pressure: 1013, humidity: 72 },
        name: 'London',
      })

    const conn = createConnector()
    conn.init({ apiKey: API_KEY })
    const weather = await conn.weather.getCurrent({ q: 'London' })

    expect(weather.name).toBe('London')
    expect(weather.main?.temp).toBe(289.15)
    expect(weather.weather?.[0].main).toBe('Clear')
  })

  it('gets 5-day forecast', async () => {
    nock(BASE_URL)
      .get('/data/2.5/forecast')
      .query({ q: 'London', appid: API_KEY })
      .reply(200, {
        cod: '200',
        cnt: 40,
        list: [
          {
            dt: 1234567890,
            main: { temp: 289.15 },
            weather: [{ main: 'Clear' }],
            dt_txt: '2023-01-01 12:00:00',
          },
        ],
        city: { name: 'London', country: 'GB' },
      })

    const conn = createConnector()
    conn.init({ apiKey: API_KEY })
    const forecast = await conn.forecast.get5Day({ q: 'London' })

    expect(forecast.city.name).toBe('London')
    expect(forecast.list.length).toBe(1)
    expect(forecast.list[0].main.temp).toBe(289.15)
  })

  it('gets current air pollution', async () => {
    nock(BASE_URL)
      .get('/data/2.5/air_pollution')
      .query({ lat: 51.5085, lon: -0.1257, appid: API_KEY })
      .reply(200, {
        coord: { lon: -0.1257, lat: 51.5085 },
        list: [
          {
            main: { aqi: 1 },
            components: { co: 201.94, no: 0.01, no2: 0.78, o3: 68.66, so2: 0.64, pm2_5: 0.5, pm10: 0.59, nh3: 0.12 },
            dt: 1234567890,
          },
        ],
      })

    const conn = createConnector()
    conn.init({ apiKey: API_KEY })
    const airPollution = await conn.airPollution.getCurrent({ lat: 51.5085, lon: -0.1257 })

    expect(airPollution.list.length).toBe(1)
    expect(airPollution.list[0].main.aqi).toBe(1)
  })

  it('performs direct geocoding', async () => {
    nock(BASE_URL)
      .get('/geo/1.0/direct')
      .query({ q: 'London', appid: API_KEY })
      .reply(200, [
        {
          name: 'London',
          lat: 51.5085,
          lon: -0.1257,
          country: 'GB',
        },
      ])

    const conn = createConnector()
    conn.init({ apiKey: API_KEY })
    const locations = await conn.geocoding.direct({ q: 'London' })

    expect(locations.length).toBe(1)
    expect(locations[0].name).toBe('London')
    expect(locations[0].country).toBe('GB')
  })
})

