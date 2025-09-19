import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import type { Hook } from './hooks'

export type ValidationOptions = {
  openApiSchema?: any
  responseSchemaResolver?: (operationId?: string, path?: string, method?: string, status?: number) => any | undefined
}

export function createValidationHook(opts: ValidationOptions): Hook {
  const ajv = new Ajv({ strict: false, validateFormats: true })
  addFormats(ajv)
  ajv.addFormat('int32', { type: 'number', validate: (n: number) => Number.isInteger(n) })
  ajv.addFormat('double', { type: 'number', validate: (n: number) => Number.isFinite(n) })
  if (opts.openApiSchema) ajv.addSchema(opts.openApiSchema, 'openapi')

  return async (ctx) => {
    if (ctx.type !== 'afterResponse' || !ctx.response) return
    const status = ctx.response.status ?? 200
    const schema = opts.responseSchemaResolver?.(ctx.request?.operation, ctx.request?.path, ctx.request?.method, status)
    if (!schema) return
    const toCompile = (schema && typeof schema === 'object' && typeof (schema as any).$ref === 'string' && (schema as any).$ref.startsWith('#/'))
      ? { $ref: `openapi${(schema as any).$ref}` }
      : schema
    const validate = ajv.compile(toCompile)
    const ok = validate(ctx.response.data)
    if (!ok) {
      const message = `VALIDATION_ERROR: ${ajv.errorsText(validate.errors)}`
      const err: any = new Error(message)
      err.code = 'VALIDATION_ERROR'
      err.statusCode = status
      err.details = validate.errors
      throw err
    }
  }
}


