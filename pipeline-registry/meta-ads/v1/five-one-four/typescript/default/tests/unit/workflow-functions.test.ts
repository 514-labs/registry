import { describe, it, expect } from 'vitest';

describe('Meta Ads Workflow Utility Functions', () => {
  describe('Data Processing Logic', () => {
    it('should clean properties correctly', () => {
      // Test the property cleaning logic that would be used in the workflow
      const rawProperties = {
        valid_field: 'value',
        null_field: null,
        undefined_field: undefined,
        empty_string: '',
        zero_value: 0,
        false_value: false
      };

      const cleanProperties: Record<string, string> = {};
      for (const [key, value] of Object.entries(rawProperties)) {
        if (value !== null && value !== undefined && value !== "") {
          cleanProperties[key] = String(value);
        }
      }

      expect(cleanProperties).toEqual({
        valid_field: 'value',
        zero_value: '0',
        false_value: 'false'
      });
    });

    it('should generate proper insight IDs', () => {
      // Test the ID generation logic used for insights
      const campaignId = 'campaign123';
      const dateStart = '2023-01-01';
      const dateStop = '2023-01-01';
      const adAccountId = 'act_123456789';

      const insightId = `${campaignId || adAccountId}-${dateStart}-${dateStop}`;

      expect(insightId).toBe('campaign123-2023-01-01-2023-01-01');
    });

    it('should handle missing campaign ID in insights', () => {
      const campaignId = undefined;
      const dateStart = '2023-01-01';
      const dateStop = '2023-01-01';
      const adAccountId = 'act_123456789';

      const insightId = `${campaignId || adAccountId}-${dateStart}-${dateStop}`;

      expect(insightId).toBe('act_123456789-2023-01-01-2023-01-01');
    });

    it('should calculate time ranges properly', () => {
      // Test the 30-day time range calculation
      const endDate = new Date('2023-02-01T00:00:00Z');
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);

      const timeRange = {
        since: startDate.toISOString().split('T')[0],
        until: endDate.toISOString().split('T')[0],
      };

      expect(timeRange.since).toBe('2023-01-02');
      expect(timeRange.until).toBe('2023-02-01');
    });
  });
});