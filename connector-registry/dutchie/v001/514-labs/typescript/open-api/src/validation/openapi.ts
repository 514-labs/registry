import type { Hook } from '../lib/hooks'
import { createValidationHook } from '../lib/validation'

function escapeJsonPointerSegment(seg: string): string {
  return seg.replace(/~/g, '~0').replace(/\//g, '~1')
}

export function resolveOpenApiResponseSchema(
  openApi: any,
  path: string | undefined,
  method: string | undefined,
  status: number | undefined,
): any | undefined {
  if (!openApi || !path || !method) return undefined
  const methodKey = method.toLowerCase()
  const statusKey = String(status ?? 200)
  const escapedPath = escapeJsonPointerSegment(path)
  // Build a JSON Pointer to the exact response schema location under the OpenAPI root
  const pointer = `#/paths/${escapedPath}/${methodKey}/responses/${statusKey}/content/application~1json/schema`
  // Fall back to 200 if specific status not present
  const pointer200 = `#/paths/${escapedPath}/${methodKey}/responses/200/content/application~1json/schema`
  // Return a $ref so Ajv resolves within the added OpenAPI root schema
  const pathItem = openApi.paths?.[path]
  if (!pathItem?.[methodKey]) return undefined
  const hasStatus = !!pathItem[methodKey].responses?.[statusKey]
  const ref = hasStatus ? pointer : pointer200
  return { $ref: ref }
}

export function createOpenApiValidationHook(openApi: any): Hook {
  return createValidationHook({
    openApiSchema: openApi,
    responseSchemaResolver: (_op, path, method, status) =>
      resolveOpenApiResponseSchema(openApi, path, method, status),
  })
}


