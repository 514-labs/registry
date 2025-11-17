/* eslint-env jest */
// @ts-nocheck
import nock from 'nock'
import { createConnector } from '../src'

describe('Klaviyo Connector', () => {
  const BASE_URL = 'https://a.klaviyo.com'

  afterEach(() => {
    nock.cleanAll()
  })

  describe('Profiles', () => {
    it('should list profiles with pagination', async () => {
      const mockProfiles1 = {
        data: [
          { type: 'profile', id: '1', attributes: { email: 'user1@example.com' } },
          { type: 'profile', id: '2', attributes: { email: 'user2@example.com' } },
        ],
        links: {
          next: `${BASE_URL}/api/profiles/?page[cursor]=cursor123`,
        },
      }

      const mockProfiles2 = {
        data: [
          { type: 'profile', id: '3', attributes: { email: 'user3@example.com' } },
        ],
        links: {
          next: null,
        },
      }

      nock(BASE_URL)
        .get('/api/profiles/')
        .query({ 'page[size]': 2 })
        .reply(200, mockProfiles1)

      nock(BASE_URL)
        .get('/api/profiles/')
        .query({ 'page[size]': 2, 'page[cursor]': 'cursor123' })
        .reply(200, mockProfiles2)

      const conn = createConnector()
      conn.init({ apiKey: 'test-key' })

      const pages = []
      for await (const page of conn.profiles.list({ pageSize: 2 })) {
        pages.push(page)
      }

      expect(pages).toHaveLength(2)
      expect(pages[0]).toHaveLength(2)
      expect(pages[1]).toHaveLength(1)
      expect(pages[0][0].attributes.email).toBe('user1@example.com')
      expect(pages[1][0].attributes.email).toBe('user3@example.com')
    })

    it('should get a single profile', async () => {
      const mockProfile = {
        data: {
          type: 'profile',
          id: '123',
          attributes: { email: 'test@example.com', first_name: 'Test' },
        },
      }

      nock(BASE_URL)
        .get('/api/profiles/123')
        .reply(200, mockProfile)

      const conn = createConnector()
      conn.init({ apiKey: 'test-key' })

      const profile = await conn.profiles.get('123')
      expect(profile.id).toBe('123')
      expect(profile.attributes.email).toBe('test@example.com')
    })

    it('should filter profiles by email', async () => {
      const mockProfiles = {
        data: [
          { type: 'profile', id: '1', attributes: { email: 'specific@example.com' } },
        ],
        links: { next: null },
      }

      nock(BASE_URL)
        .get('/api/profiles/')
        .query({ 'page[size]': 100, 'filter[email]': 'specific@example.com' })
        .reply(200, mockProfiles)

      const conn = createConnector()
      conn.init({ apiKey: 'test-key' })

      const pages = []
      for await (const page of conn.profiles.list({ 'filter[email]': 'specific@example.com' })) {
        pages.push(page)
      }

      expect(pages).toHaveLength(1)
      expect(pages[0][0].attributes.email).toBe('specific@example.com')
    })
  })

  describe('Lists', () => {
    it('should list lists with pagination', async () => {
      const mockLists = {
        data: [
          { type: 'list', id: '1', attributes: { name: 'Newsletter' } },
          { type: 'list', id: '2', attributes: { name: 'VIP Customers' } },
        ],
        links: { next: null },
      }

      nock(BASE_URL)
        .get('/api/lists/')
        .query({ 'page[size]': 100 })
        .reply(200, mockLists)

      const conn = createConnector()
      conn.init({ apiKey: 'test-key' })

      const pages = []
      for await (const page of conn.lists.list()) {
        pages.push(page)
      }

      expect(pages).toHaveLength(1)
      expect(pages[0]).toHaveLength(2)
      expect(pages[0][0].attributes.name).toBe('Newsletter')
    })

    it('should get a single list', async () => {
      const mockList = {
        data: {
          type: 'list',
          id: '123',
          attributes: { name: 'Test List' },
        },
      }

      nock(BASE_URL)
        .get('/api/lists/123')
        .reply(200, mockList)

      const conn = createConnector()
      conn.init({ apiKey: 'test-key' })

      const list = await conn.lists.get('123')
      expect(list.id).toBe('123')
      expect(list.attributes.name).toBe('Test List')
    })
  })

  describe('Campaigns', () => {
    it('should list campaigns with pagination', async () => {
      const mockCampaigns = {
        data: [
          { type: 'campaign', id: '1', attributes: { name: 'Summer Sale', status: 'sent' } },
          { type: 'campaign', id: '2', attributes: { name: 'Welcome Series', status: 'draft' } },
        ],
        links: { next: null },
      }

      nock(BASE_URL)
        .get('/api/campaigns/')
        .query({ 'page[size]': 100 })
        .reply(200, mockCampaigns)

      const conn = createConnector()
      conn.init({ apiKey: 'test-key' })

      const pages = []
      for await (const page of conn.campaigns.list()) {
        pages.push(page)
      }

      expect(pages).toHaveLength(1)
      expect(pages[0]).toHaveLength(2)
      expect(pages[0][0].attributes.name).toBe('Summer Sale')
      expect(pages[0][0].attributes.status).toBe('sent')
    })

    it('should get a single campaign', async () => {
      const mockCampaign = {
        data: {
          type: 'campaign',
          id: '123',
          attributes: { name: 'Test Campaign', status: 'scheduled' },
        },
      }

      nock(BASE_URL)
        .get('/api/campaigns/123')
        .reply(200, mockCampaign)

      const conn = createConnector()
      conn.init({ apiKey: 'test-key' })

      const campaign = await conn.campaigns.get('123')
      expect(campaign.id).toBe('123')
      expect(campaign.attributes.name).toBe('Test Campaign')
      expect(campaign.attributes.status).toBe('scheduled')
    })
  })

  describe('Authentication', () => {
    it('should include API key in Authorization header', async () => {
      const mockProfiles = {
        data: [],
        links: { next: null },
      }

      const scope = nock(BASE_URL, {
        reqheaders: {
          'authorization': 'Klaviyo-API-Key test-api-key',
          'revision': '2024-10-15',
        },
      })
        .get('/api/profiles/')
        .query({ 'page[size]': 100 })
        .reply(200, mockProfiles)

      const conn = createConnector()
      conn.init({ apiKey: 'test-api-key' })

      const pages = []
      for await (const page of conn.profiles.list()) {
        pages.push(page)
      }

      expect(scope.isDone()).toBe(true)
    })

    it('should use custom revision if provided', async () => {
      const mockProfiles = {
        data: [],
        links: { next: null },
      }

      const scope = nock(BASE_URL, {
        reqheaders: {
          'revision': '2024-01-01',
        },
      })
        .get('/api/profiles/')
        .query({ 'page[size]': 100 })
        .reply(200, mockProfiles)

      const conn = createConnector()
      conn.init({ apiKey: 'test-api-key', revision: '2024-01-01' })

      const pages = []
      for await (const page of conn.profiles.list()) {
        pages.push(page)
      }

      expect(scope.isDone()).toBe(true)
    })
  })

  describe('Pagination', () => {
    it('should respect maxItems limit', async () => {
      const mockProfiles1 = {
        data: [
          { type: 'profile', id: '1', attributes: { email: 'user1@example.com' } },
          { type: 'profile', id: '2', attributes: { email: 'user2@example.com' } },
          { type: 'profile', id: '3', attributes: { email: 'user3@example.com' } },
        ],
        links: {
          next: `${BASE_URL}/api/profiles/?page[cursor]=cursor123`,
        },
      }

      nock(BASE_URL)
        .get('/api/profiles/')
        .query({ 'page[size]': 3 })
        .reply(200, mockProfiles1)

      const conn = createConnector()
      conn.init({ apiKey: 'test-key' })

      const pages = []
      for await (const page of conn.profiles.list({ pageSize: 3, maxItems: 3 })) {
        pages.push(page)
      }

      expect(pages).toHaveLength(1)
      expect(pages[0]).toHaveLength(3)
    })
  })
})

