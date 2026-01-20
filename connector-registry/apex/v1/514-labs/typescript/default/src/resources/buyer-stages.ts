import { paginatePages } from '../lib/paginate'
import type { SendFn } from '../lib/paginate'

/**
 * Buyer Stage resource from Apex API
 */
export interface BuyerStage {
  id: number
  sort_order: number
  name: string
  color: string
  created_at: string
  updated_at: string
}

export const createResource = (send: SendFn) => ({
  /**
   * List all buyer stages with pagination
   */
  async *list(params?: { pageSize?: number; maxItems?: number }) {
    const { pageSize, maxItems } = params ?? {}

    yield* paginatePages<BuyerStage>({
      send,
      path: '/v1/buyer-stages',
      pageSize: pageSize ?? 15,
      maxItems,
      extractItems: (res: any) => {
        return Array.isArray(res.stages) ? res.stages : []
      }
    })
  },

  /**
   * Get a single buyer stage by ID
   */
  async get(stageId: number): Promise<BuyerStage> {
    const response = await send<{ stage: BuyerStage }>({
      method: 'GET',
      path: `/v1/buyer-stages/${stageId}`,
    })
    return response.data.stage
  }
})
