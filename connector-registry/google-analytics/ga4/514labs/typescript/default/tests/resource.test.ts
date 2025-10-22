/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

it('runReport returns report data with rows', async () => {
  const BASE = 'https://analyticsdata.googleapis.com/v1beta'
  const propertyId = '123456789'
  const mockResponse = {
    dimensionHeaders: [{ name: 'date' }],
    metricHeaders: [{ name: 'activeUsers', type: 'TYPE_INTEGER' }],
    rows: [
      { dimensionValues: [{ value: '20240101' }], metricValues: [{ value: '100' }] },
      { dimensionValues: [{ value: '20240102' }], metricValues: [{ value: '150' }] }
    ],
    rowCount: 2
  }

  nock(BASE)
    .post(`/properties/${propertyId}:runReport`)
    .reply(200, mockResponse)

  const conn = createConnector()
  conn.initialize({
    baseUrl: BASE,
    auth: { type: 'bearer', bearer: { token: 'test-token' } }
  })

  const result = await conn.reports.runReport(propertyId, {
    dateRanges: [{ startDate: '2024-01-01', endDate: '2024-01-02' }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'activeUsers' }]
  })

  expect(result.rows).toHaveLength(2)
  expect(result.rowCount).toBe(2)
  expect(result.dimensionHeaders?.[0].name).toBe('date')
  expect(result.metricHeaders?.[0].name).toBe('activeUsers')
})
