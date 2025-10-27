import type { SendFn } from './paginate'
import type { HttpResponseEnvelope } from '../types/envelopes'

/**
 * Create a Meta Ads resource with cursor-based pagination that requires adAccountId.
 *
 * This is adapted for Meta Ads API which uses cursor-based pagination
 * with adAccountId parameter pattern.
 */
export function makeMetaResource<
  Item,
  ListParams extends Record<string, unknown> = Record<string, never>
>(
  basePath: string,
  send: SendFn,
  options?: {
    buildListQuery?: (params?: ListParams) => Record<string, string | number | boolean | undefined>
  }
) {
  return {
    /**
     * List items with pagination support.
     * Returns a single page of results with paging metadata.
     */
    async list(
      params: { adAccountId: string } & ListParams & {
        fields?: string[]
        limit?: number
        after?: string
      }
    ): Promise<HttpResponseEnvelope<Item[]>> {
      const { adAccountId, fields, limit, after, ...rest } = params as any
      const query: Record<string, any> = {}

      if (fields?.length) query.fields = fields.join(',')
      if (limit) query.limit = limit.toString()
      if (after) query.after = after

      // Add custom query params from buildListQuery
      if (options?.buildListQuery) {
        Object.assign(query, options.buildListQuery(rest))
      }

      // Replace {ad_account_id} placeholder
      const path = basePath.replace('{ad_account_id}', adAccountId)

      return send({
        method: 'GET',
        path,
        query,
      })
    },

    /**
     * Get a single item by ID.
     */
    async get(
      params: {
        adAccountId: string
        id: string
        fields?: string[]
      }
    ): Promise<HttpResponseEnvelope<Item>> {
      const { adAccountId, fields, id } = params
      const query: Record<string, any> = {}

      if (fields?.length) query.fields = fields.join(',')

      // Replace {ad_account_id} placeholder
      const path = basePath.replace('{ad_account_id}', adAccountId)

      return send({
        method: 'GET',
        path: `${path}/${id}`,
        query,
      })
    },

    /**
     * Stream items using async iteration with automatic pagination.
     * Handles Meta Ads cursor-based pagination automatically.
     */
    async *stream(
      params: { adAccountId: string } & ListParams & {
        fields?: string[]
        pageSize?: number
      }
    ): AsyncIterable<Item> {
      const { pageSize = 25, ...listParams } = params as any
      let after: string | undefined

      do {
        const response = await this.list({
          ...listParams,
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

    /**
     * Get all items up to maxItems limit.
     * Automatically handles pagination using stream().
     */
    async getAll(
      params: { adAccountId: string } & ListParams & {
        fields?: string[]
        pageSize?: number
        maxItems?: number
      }
    ): Promise<Item[]> {
      const { maxItems = 1000, ...streamParams } = params
      const items: Item[] = []
      let count = 0

      for await (const item of this.stream(streamParams as any)) {
        items.push(item)
        count++
        if (count >= maxItems) break
      }

      return items
    },
  }
}

/**
 * Create a global Meta Ads resource (no adAccountId required).
 * Used for resources like businesses, pages that don't require account context.
 */
export function makeGlobalMetaResource<
  Item,
  ListParams extends Record<string, unknown> = Record<string, never>
>(
  basePath: string,
  send: SendFn,
  options?: {
    buildListQuery?: (params?: ListParams) => Record<string, string | number | boolean | undefined>
  }
) {
  return {
    /**
     * List items with pagination support.
     * Returns a single page of results with paging metadata.
     */
    async list(
      params?: ListParams & {
        fields?: string[]
        limit?: number
        after?: string
      }
    ): Promise<HttpResponseEnvelope<Item[]>> {
      const { fields, limit, after, ...rest } = (params || {}) as any
      const query: Record<string, any> = {}

      if (fields?.length) query.fields = fields.join(',')
      if (limit) query.limit = limit.toString()
      if (after) query.after = after

      // Add custom query params from buildListQuery
      if (options?.buildListQuery) {
        Object.assign(query, options.buildListQuery(rest))
      }

      return send({
        method: 'GET',
        path: basePath,
        query,
      })
    },

    /**
     * Get a single item by ID.
     */
    async get(
      params: {
        id: string
        fields?: string[]
      }
    ): Promise<HttpResponseEnvelope<Item>> {
      const { fields, id } = params
      const query: Record<string, any> = {}

      if (fields?.length) query.fields = fields.join(',')

      return send({
        method: 'GET',
        path: `/${id}`,
        query,
      })
    },

    /**
     * Stream items using async iteration with automatic pagination.
     * Handles Meta Ads cursor-based pagination automatically.
     */
    async *stream(
      params?: ListParams & {
        fields?: string[]
        pageSize?: number
      }
    ): AsyncIterable<Item> {
      const { pageSize = 25, ...listParams } = (params || {}) as any
      let after: string | undefined

      do {
        const response = await this.list({
          ...listParams,
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

    /**
     * Get all items up to maxItems limit.
     * Automatically handles pagination using stream().
     */
    async getAll(
      params?: ListParams & {
        fields?: string[]
        pageSize?: number
        maxItems?: number
      }
    ): Promise<Item[]> {
      const { maxItems = 1000, ...streamParams } = params || {}
      const items: Item[] = []
      let count = 0

      for await (const item of this.stream(streamParams as any)) {
        items.push(item)
        count++
        if (count >= maxItems) break
      }

      return items
    },
  }
}
