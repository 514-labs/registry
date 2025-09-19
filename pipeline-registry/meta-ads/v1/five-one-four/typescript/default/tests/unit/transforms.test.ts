import { describe, it, expect } from 'vitest';
import { transformMetaAdsInsight } from '../../app/ingest/metaAdsTransforms';
import type { MetaAdsCampaignRaw, MetaAdsInsightRaw } from '../../app/ingest/metaAdsModels';
import transformMetaAdsCampaign from '../../app/ingest/metaAdsTransforms';

describe('Meta Ads Transforms', () => {
  describe('transformMetaAdsCampaign', () => {
    it('transforms campaign with daily budget', () => {
      const rawCampaign: MetaAdsCampaignRaw = {
        id: 'campaign123',
        adAccountId: 'act_123456789',
        name: 'Test Campaign',
        status: 'ACTIVE',
        objective: 'CONVERSIONS',
        createdTime: '2023-01-01T00:00:00Z',
        updatedTime: '2023-01-02T00:00:00Z',
        startTime: '2023-01-01T00:00:00Z',
        stopTime: '2023-12-31T23:59:59Z',
        dailyBudget: 100,
        lifetimeBudget: undefined,
        spendCap: 5000,
        bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
        budgetRemaining: 4500,
        properties: { custom_field: 'value' }
      };

      const result = transformMetaAdsCampaign(rawCampaign);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'campaign123',
        adAccountId: 'act_123456789',
        name: 'Test Campaign',
        status: 'ACTIVE',
        objective: 'CONVERSIONS',
        isActive: true,
        hasEndDate: true,
        budget: 100,
        budgetType: 'daily',
        dailyBudget: 100,
        spendCap: 5000,
        bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
        budgetRemaining: 4500
      });

      expect(result[0].createdTime).toBeInstanceOf(Date);
      expect(result[0].updatedTime).toBeInstanceOf(Date);
      expect(result[0].startTime).toBeInstanceOf(Date);
      expect(result[0].stopTime).toBeInstanceOf(Date);
    });

    it('transforms campaign with lifetime budget', () => {
      const rawCampaign: MetaAdsCampaignRaw = {
        id: 'campaign456',
        adAccountId: 'act_123456789',
        name: 'Lifetime Campaign',
        status: 'PAUSED',
        objective: 'REACH',
        createdTime: '2023-01-01T00:00:00Z',
        updatedTime: '2023-01-02T00:00:00Z',
        lifetimeBudget: 1000,
        properties: {}
      };

      const result = transformMetaAdsCampaign(rawCampaign);

      expect(result[0]).toMatchObject({
        isActive: false,
        hasEndDate: false,
        budget: 1000,
        budgetType: 'lifetime',
        lifetimeBudget: 1000
      });
    });

    it('transforms campaign with no budget', () => {
      const rawCampaign: MetaAdsCampaignRaw = {
        id: 'campaign789',
        adAccountId: 'act_123456789',
        name: 'No Budget Campaign',
        status: 'ACTIVE',
        objective: 'TRAFFIC',
        createdTime: '2023-01-01T00:00:00Z',
        updatedTime: '2023-01-02T00:00:00Z',
        properties: {}
      };

      const result = transformMetaAdsCampaign(rawCampaign);

      expect(result[0]).toMatchObject({
        budget: 0,
        budgetType: 'none'
      });
    });
  });

  describe('transformMetaAdsInsight', () => {
    it('transforms insight data with calculations', () => {
      const rawInsight: MetaAdsInsightRaw = {
        id: 'insight123',
        adAccountId: 'act_123456789',
        campaignId: 'campaign123',
        level: 'campaign',
        dateStart: '2023-01-01',
        dateStop: '2023-01-01',
        impressions: 10000,
        clicks: 500,
        spend: 250.50,
        reach: 8000,
        frequency: 1.25,
        cpm: 25.05,
        cpc: 0.501,
        ctr: 5.0,
        properties: {}
      };

      const result = transformMetaAdsInsight(rawInsight);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'insight123',
        adAccountId: 'act_123456789',
        campaignId: 'campaign123',
        level: 'campaign',
        impressions: 10000,
        clicks: 500,
        spend: 250.50,
        reach: 8000,
        frequency: 1.25,
        cpm: 25.05,
        cpc: 0.501,
        ctr: 5.0,
        conversions: 0,
        costPerConversion: 0,
        roas: 0
      });

      expect(result[0].dateStart).toBeInstanceOf(Date);
      expect(result[0].dateStop).toBeInstanceOf(Date);
    });

    it('handles missing metrics gracefully', () => {
      const rawInsight: MetaAdsInsightRaw = {
        id: 'insight456',
        adAccountId: 'act_123456789',
        level: 'account',
        dateStart: '2023-01-01',
        dateStop: '2023-01-01',
        properties: {}
      };

      const result = transformMetaAdsInsight(rawInsight);

      expect(result[0]).toMatchObject({
        impressions: 0,
        clicks: 0,
        spend: 0,
        reach: 0,
        frequency: 0,
        cpm: 0,
        cpc: 0,
        ctr: 0
      });
    });

    it('calculates ROAS correctly with spend', () => {
      const rawInsight: MetaAdsInsightRaw = {
        id: 'insight789',
        adAccountId: 'act_123456789',
        level: 'ad',
        dateStart: '2023-01-01',
        dateStop: '2023-01-01',
        spend: 100,
        properties: {}
      };

      const result = transformMetaAdsInsight(rawInsight);

      // ROAS = (conversions * $50 avg value) / spend
      // With 0 conversions: 0 * 50 / 100 = 0
      expect(result[0].roas).toBe(0);
      expect(result[0].costPerConversion).toBe(0);
    });
  });
});