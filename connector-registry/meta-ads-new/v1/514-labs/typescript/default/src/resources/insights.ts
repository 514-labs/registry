import type { Insight } from '../types/connector'
import type { HttpResponseEnvelope } from '../types/envelopes'
import type { SendFn } from '../lib/paginate'

export interface InsightsListParams {
  objectId: string
  level: 'account' | 'campaign' | 'adset' | 'ad'
  fields?: string[]
  timeRange?: { since: string; until: string }
  datePreset?: 'today' | 'yesterday' | 'this_month' | 'last_month' | 'this_quarter' | 'maximum' | 'data_maximum' | 'last_3d' | 'last_7d' | 'last_14d' | 'last_28d' | 'last_30d' | 'last_90d' | 'last_week_mon_sun' | 'last_week_sun_sat' | 'last_quarter' | 'last_year' | 'this_week_mon_today' | 'this_week_sun_today' | 'this_year'
  breakdowns?: ('action_device' | 'action_canvas_component_name' | 'action_carousel_card_id' | 'action_carousel_card_name' | 'action_destination' | 'action_reaction' | 'age' | 'country' | 'device_platform' | 'gender' | 'hourly_stats_aggregated_by_advertiser_time_zone' | 'hourly_stats_aggregated_by_audience_time_zone' | 'impression_device' | 'platform_position' | 'publisher_platform' | 'region')[]
  actionBreakdowns?: ('action_device' | 'action_canvas_component_name' | 'action_carousel_card_id' | 'action_carousel_card_name' | 'action_destination' | 'action_reaction' | 'action_type' | 'action_video_sound' | 'action_video_type')[]
  actionAttributionWindows?: ('1d_click' | '7d_click' | '28d_click' | '1d_view' | '7d_view' | '28d_view' | 'default')[]
  limit?: number
  after?: string
}

export interface InsightsStreamParams {
  objectId: string
  level: 'account' | 'campaign' | 'adset' | 'ad'
  fields?: string[]
  timeRange?: { since: string; until: string }
  datePreset?: 'today' | 'yesterday' | 'this_month' | 'last_month' | 'this_quarter' | 'maximum' | 'data_maximum' | 'last_3d' | 'last_7d' | 'last_14d' | 'last_28d' | 'last_30d' | 'last_90d' | 'last_week_mon_sun' | 'last_week_sun_sat' | 'last_quarter' | 'last_year' | 'this_week_mon_today' | 'this_week_sun_today' | 'this_year'
  breakdowns?: ('action_device' | 'action_canvas_component_name' | 'action_carousel_card_id' | 'action_carousel_card_name' | 'action_destination' | 'action_reaction' | 'age' | 'country' | 'device_platform' | 'gender' | 'hourly_stats_aggregated_by_advertiser_time_zone' | 'hourly_stats_aggregated_by_audience_time_zone' | 'impression_device' | 'platform_position' | 'publisher_platform' | 'region')[]
  actionBreakdowns?: ('action_device' | 'action_canvas_component_name' | 'action_carousel_card_id' | 'action_carousel_card_name' | 'action_destination' | 'action_reaction' | 'action_type' | 'action_video_sound' | 'action_video_type')[]
  actionAttributionWindows?: ('1d_click' | '7d_click' | '28d_click' | '1d_view' | '7d_view' | '28d_view' | 'default')[]
  pageSize?: number
}

/**
 * Creates the insights resource for Meta Ads API.
 *
 * Insights have a custom API that differs from standard resources.
 * It uses objectId instead of adAccountId and has specific parameters.
 */
export const createInsightsResource = (send: SendFn) => {
  const api = {
    async list(params: InsightsListParams): Promise<HttpResponseEnvelope<Insight[]>> {
      const { objectId, level, fields, timeRange, datePreset, breakdowns, actionBreakdowns, actionAttributionWindows, limit, after } = params
      const query: Record<string, any> = { level }

      if (fields?.length) query.fields = fields.join(',')
      if (timeRange) {
        query.time_range = JSON.stringify(timeRange)
      }
      if (datePreset) query.date_preset = datePreset
      if (breakdowns?.length) query.breakdowns = breakdowns.join(',')
      if (actionBreakdowns?.length) query.action_breakdowns = actionBreakdowns.join(',')
      if (actionAttributionWindows?.length) query.action_attribution_windows = JSON.stringify(actionAttributionWindows)
      if (limit) query.limit = limit.toString()
      if (after) query.after = after

      return send({
        method: 'GET',
        path: `/${objectId}/insights`,
        query,
      })
    },

    // Alias for backwards compatibility - insights uses get in the type definition
    async get(params: InsightsListParams): Promise<HttpResponseEnvelope<Insight[]>> {
      return api.list(params)
    },

    async* stream(params: InsightsStreamParams): AsyncIterable<Insight> {
      const { pageSize = 25, ...requestParams } = params
      let after: string | undefined

      do {
        const response = await api.list({
          ...requestParams,
          limit: pageSize,
          after,
        })

        if (response.data && Array.isArray(response.data)) {
          for (const item of response.data) {
            yield item
          }
        }

        after = response.paging?.cursors?.after
      } while (after)
    },

    async getAll(params: InsightsStreamParams & { maxItems?: number }): Promise<Insight[]> {
      const { maxItems = 1000, ...streamParams } = params
      const items: Insight[] = []
      let count = 0

      for await (const item of api.stream(streamParams)) {
        items.push(item)
        count++
        if (count >= maxItems) break
      }

      return items
    },
  }

  return api
}
