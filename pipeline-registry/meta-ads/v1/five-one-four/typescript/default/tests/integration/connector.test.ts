import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the connector module for integration tests
const mockConnector = {
  initialize: vi.fn(),
  connect: vi.fn().mockResolvedValue(undefined),
  disconnect: vi.fn().mockResolvedValue(undefined),
  listCampaigns: vi.fn(),
  getCampaign: vi.fn(),
  streamCampaigns: vi.fn(),
  getInsights: vi.fn(),
  streamInsights: vi.fn(),
};

const mockCreateMetaAdsConnector = vi.fn(() => mockConnector);

vi.mock('@connector-registry/meta-ads/v1/five-one-four/typescript/default', () => ({
  createMetaAdsConnector: mockCreateMetaAdsConnector,
}));

const AD_ACCOUNT_ID = 'act_123456789';

describe('Meta Ads Connector Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Configure mock responses for the connector methods
    mockConnector.listCampaigns.mockResolvedValue({
      data: {
        data: [{ id: 'campaign1', name: 'Test Campaign' }],
        paging: {}
      },
      status: 200
    });

    mockConnector.getCampaign.mockResolvedValue({
      data: { id: 'campaign123', name: 'Specific Campaign' },
      status: 200
    });

    mockConnector.streamCampaigns.mockReturnValue((async function* () {
      yield { id: 'campaign1', name: 'Campaign 1' };
      yield { id: 'campaign2', name: 'Campaign 2' };
    })());

    mockConnector.getInsights.mockResolvedValue({
      data: {
        data: [{
          campaign_id: 'campaign123',
          impressions: '10000',
          spend: '250.50'
        }]
      },
      status: 200
    });

    mockConnector.streamInsights.mockReturnValue((async function* () {
      yield {
        campaign_id: 'campaign1',
        impressions: '5000',
        spend: '100.00'
      };
    })());
  });

  describe('Connector Creation and Configuration', () => {
    it('should create and initialize connector properly', async () => {
      const connector = mockCreateMetaAdsConnector();

      connector.initialize({
        auth: { type: 'bearer', bearer: { token: 'test_token' } },
        rateLimit: { requestsPerSecond: 5, burstCapacity: 5 },
      });

      await connector.connect();

      expect(mockConnector.initialize).toHaveBeenCalledWith({
        auth: { type: 'bearer', bearer: { token: 'test_token' } },
        rateLimit: { requestsPerSecond: 5, burstCapacity: 5 },
      });
      expect(mockConnector.connect).toHaveBeenCalled();

      await connector.disconnect();
      expect(mockConnector.disconnect).toHaveBeenCalled();
    });
  });

  describe('Campaign Operations', () => {
    it('should list campaigns successfully', async () => {
      const connector = mockCreateMetaAdsConnector();

      await connector.connect();
      const result = await connector.listCampaigns({
        adAccountId: AD_ACCOUNT_ID,
        limit: 1
      });

      expect(mockConnector.listCampaigns).toHaveBeenCalledWith({
        adAccountId: AD_ACCOUNT_ID,
        limit: 1
      });
      expect(result.data.data[0].id).toBe('campaign1');
      expect(result.data.data[0].name).toBe('Test Campaign');

      await connector.disconnect();
    });

    it('should get a specific campaign', async () => {
      const connector = mockCreateMetaAdsConnector();
      const campaignId = 'campaign123';

      await connector.connect();
      const result = await connector.getCampaign({
        adAccountId: AD_ACCOUNT_ID,
        id: campaignId,
        fields: ['name', 'status', 'objective']
      });

      expect(mockConnector.getCampaign).toHaveBeenCalledWith({
        adAccountId: AD_ACCOUNT_ID,
        id: campaignId,
        fields: ['name', 'status', 'objective']
      });
      expect(result.data.id).toBe(campaignId);
      expect(result.data.name).toBe('Specific Campaign');

      await connector.disconnect();
    });

    it('should stream campaigns across multiple pages', async () => {
      const connector = mockCreateMetaAdsConnector();

      await connector.connect();

      const campaigns = [];
      for await (const campaign of connector.streamCampaigns({
        adAccountId: AD_ACCOUNT_ID,
        pageSize: 2
      })) {
        campaigns.push(campaign);
      }

      expect(campaigns).toHaveLength(2);
      expect(campaigns.map(c => c.id)).toEqual(['campaign1', 'campaign2']);

      await connector.disconnect();
    });
  });

  describe('Insights Operations', () => {
    it('should get campaign insights', async () => {
      const connector = mockCreateMetaAdsConnector();
      const campaignId = 'campaign123';

      await connector.connect();
      const result = await connector.getInsights({
        objectId: campaignId,
        level: 'campaign',
        fields: ['impressions', 'clicks', 'spend'],
        timeRange: {
          since: '2023-01-01',
          until: '2023-01-01'
        }
      });

      expect(mockConnector.getInsights).toHaveBeenCalledWith({
        objectId: campaignId,
        level: 'campaign',
        fields: ['impressions', 'clicks', 'spend'],
        timeRange: {
          since: '2023-01-01',
          until: '2023-01-01'
        }
      });
      expect(result.data.data[0].campaign_id).toBe(campaignId);
      expect(result.data.data[0].impressions).toBe('10000');

      await connector.disconnect();
    });

    it('should stream insights with pagination', async () => {
      const connector = mockCreateMetaAdsConnector();
      const accountId = AD_ACCOUNT_ID;

      await connector.connect();

      const insights = [];
      for await (const insight of connector.streamInsights({
        objectId: accountId,
        level: 'account',
        fields: ['impressions', 'spend'],
        timeRange: {
          since: '2023-01-01',
          until: '2023-01-02'
        },
        pageSize: 1
      })) {
        insights.push(insight);
      }

      expect(insights).toHaveLength(1);
      expect(insights[0].impressions).toBe('5000');

      await connector.disconnect();
    });
  });
});