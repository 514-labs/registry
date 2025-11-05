/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('ADS-B.lol Aircraft Resource', () => {
  const BASE = 'https://api.adsb.lol'

  afterEach(() => {
    nock.cleanAll()
  })

  it('lists aircraft and yields chunks', async () => {
    const aircraft = Array.from({ length: 5 }, (_, i) => ({
      icao: `ABC${i}`,
      flight: `FLT${i}`,
      lat: 37.7 + i * 0.1,
      lon: -122.4 + i * 0.1,
      alt_baro: 10000 + i * 1000,
    }))

    nock(BASE)
      .get('/api/data/aircraft')
      .reply(200, { aircraft })

    const conn = createConnector()
    conn.init({ baseUrl: BASE })

    const pages: Array<ReadonlyArray<unknown>> = []
    for await (const page of conn.aircraft.list({ pageSize: 2 })) {
      pages.push(page)
    }

    expect(pages.length).toBe(3)
    expect(pages[0].length).toBe(2)
    expect(pages[1].length).toBe(2)
    expect(pages[2].length).toBe(1)
  })

  it('respects maxItems parameter', async () => {
    const aircraft = Array.from({ length: 10 }, (_, i) => ({
      icao: `ABC${i}`,
      lat: 37.7,
      lon: -122.4,
    }))

    nock(BASE)
      .get('/api/data/aircraft')
      .reply(200, { aircraft })

    const conn = createConnector()
    conn.init({ baseUrl: BASE })

    const all: any[] = []
    for await (const page of conn.aircraft.list({ pageSize: 3, maxItems: 5 })) {
      all.push(...page)
    }

    expect(all.length).toBe(5)
  })

  it('handles empty aircraft list', async () => {
    nock(BASE)
      .get('/api/data/aircraft')
      .reply(200, { aircraft: [] })

    const conn = createConnector()
    conn.init({ baseUrl: BASE })

    const pages: Array<ReadonlyArray<unknown>> = []
    for await (const page of conn.aircraft.list()) {
      pages.push(page)
    }

    expect(pages.length).toBe(0)
  })

  it('filters military aircraft', async () => {
    const aircraft = [
      { icao: 'MIL001', flight: 'ARMY1' },
      { icao: 'CIV001', flight: 'AA100' },
    ]

    nock(BASE)
      .get('/api/data/aircraft')
      .query({ mil: '1' })
      .reply(200, { aircraft: [aircraft[0]] })

    const conn = createConnector()
    conn.init({ baseUrl: BASE })

    const pages: any[] = []
    for await (const page of conn.aircraft.list({ military: true })) {
      pages.push(page)
    }

    expect(pages.length).toBe(1)
    expect(pages[0][0].icao).toBe('MIL001')
  })

  it('gets specific aircraft by ICAO', async () => {
    const aircraft = {
      icao: 'ABC123',
      flight: 'FLT123',
      lat: 37.7749,
      lon: -122.4194,
      alt_baro: 35000,
    }

    nock(BASE)
      .get('/api/data/aircraft/ABC123')
      .reply(200, aircraft)

    const conn = createConnector()
    conn.init({ baseUrl: BASE })

    const result = await conn.aircraft.get('ABC123')

    expect(result).toBeDefined()
    expect(result?.icao).toBe('ABC123')
    expect(result?.flight).toBe('FLT123')
  })

  it('returns null for non-existent aircraft', async () => {
    nock(BASE)
      .get('/api/data/aircraft/NOTFOUND')
      .reply(404, null)

    const conn = createConnector()
    conn.init({ baseUrl: BASE })

    const result = await conn.aircraft.get('NOTFOUND')
    expect(result).toBeNull()
  })
})
