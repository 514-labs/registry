// TODO: Replace Model with your resource type (see CONNECTOR_GUIDE.md Phase 5)
// TODO: Implement pagination using paginateOffset/paginateCursor from '../lib/paginate'
// TODO: Map your API's query parameters in buildListQuery
// TODO: Replace Model with generated types (OpenAPI/JSON Schema) in src/generated.
// TODO: Map filters to query parameters and add resource operations (list/get/create/update/delete) as needed.
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'

// OpenAPI-generated types (recommended):
// import type { Model } from '../generated'

// Manual typing fallback:
export interface Model { id?: string | number }

export const createResource = (send: SendFn) => 
  makeCrudResource<Model, { /* filters */ }>('/weather', send, {
    buildListQuery: (params) => ({ /* map typed filters to query */ }),
  })
