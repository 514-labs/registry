import fs from 'fs'
import path from 'path'
import { compile } from 'json-schema-to-typescript'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { createGenerator } from 'ts-json-schema-generator'

type FlattenOpts = {
  source: string
  type: string
  out: string
  name?: string
  delimiter?: string
}

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function isObjectSchema(s?: JSONSchema7): s is JSONSchema7 {
  if (!s) return false
  const t = (s as any).type
  const hasObjectType = t === 'object' || (Array.isArray(t) && t.includes('object'))
  const hasProps = !!s.properties && typeof s.properties === 'object'
  const hasIndexish = (s as any).additionalProperties !== undefined || (s as any).patternProperties !== undefined
  return hasObjectType || hasProps || hasIndexish
}

function hasNull(schema: JSONSchema7): boolean {
  if (Array.isArray(schema.type) && schema.type.includes('null')) return true
  const alts: JSONSchema7[] = ((schema as any).anyOf || (schema as any).oneOf || []) as JSONSchema7[]
  return alts.some((alt) => alt && (alt as any).type === 'null')
}

function withoutNull(schema: JSONSchema7): JSONSchema7 {
  if (Array.isArray(schema.type)) {
    const nonNull = schema.type.filter((t) => t !== 'null') as JSONSchema7['type']
    return { ...schema, type: nonNull.length === 1 ? nonNull[0] : nonNull }
  }
  const anyOf = (schema as any).anyOf as JSONSchema7[] | undefined
  const oneOf = (schema as any).oneOf as JSONSchema7[] | undefined
  const alts = anyOf || oneOf
  if (alts && alts.length) {
    const filtered = alts.filter((alt) => (alt as any).type !== 'null')
    const pick =
      filtered.find((s) => isObjectSchema(s)) ||
      filtered.find((s) => (s as any).type === 'array') ||
      filtered[0]
    return pick || schema
  }
  return schema
}

type FlattenResult = { properties: Record<string, JSONSchema7Definition>; required: Set<string> }

function isIndexSignatureOnlyObject(schema: JSONSchema7): boolean {
  if (!isObjectSchema(schema)) return false
  const props = (schema.properties ?? {}) as Record<string, JSONSchema7Definition>
  const hasNamedProps = Object.keys(props).length > 0
  const hasPattern = (schema as any).patternProperties && Object.keys((schema as any).patternProperties).length > 0
  const hasAdditional = (schema as any).additionalProperties !== undefined && (schema as any).additionalProperties !== false
  return !hasNamedProps && (hasPattern || hasAdditional)
}

function flattenObjectSchema(schema: JSONSchema7, delimiter: string, prefix: string[] = []): FlattenResult {
  const out: FlattenResult = { properties: {}, required: new Set<string>() }
  const req = new Set<string>(Array.isArray(schema.required) ? schema.required : [])
  const props = (schema.properties ?? {}) as Record<string, JSONSchema7Definition>

  for (const [key, def] of Object.entries(props)) {
    if (!def || typeof def !== 'object') continue
    const propSchema = def as JSONSchema7
    const isReq = req.has(key)
    const nameParts = [...prefix, key]
    const nullable = hasNull(propSchema)
    const base = withoutNull(propSchema)

    if ((base as any).type === 'array' && (base as any).items && typeof (base as any).items === 'object') {
      const items = (base as any).items as JSONSchema7
      if (isObjectSchema(items)) {
        if (isIndexSignatureOnlyObject(items)) {
          continue
        }
        const flatItems = flattenObjectSchema(items, delimiter, [])
        const newItems: JSONSchema7 = {
          type: 'object',
          additionalProperties: items.additionalProperties ?? false,
          properties: flatItems.properties,
          required: flatItems.required.size ? Array.from(flatItems.required) : undefined,
        }
        const arrName = nameParts.join(delimiter)
        const arraySchema: JSONSchema7 = { type: 'array', items: newItems }
        // Preserve nullability only when the property is required and nullable.
        // If the property is optional and nullable, strip null from the type.
        out.properties[arrName] = (nullable && isReq)
          ? ({ anyOf: [arraySchema, { type: 'null' }] } as any)
          : arraySchema
        if (isReq) out.required.add(arrName)
        continue
      }
    }

    if (isObjectSchema(base)) {
      if (isIndexSignatureOnlyObject(base)) {
        continue
      }
      const nested = flattenObjectSchema(base, delimiter, nameParts)
      for (const [nKey, nDef] of Object.entries(nested.properties)) out.properties[nKey] = nDef
      for (const nReq of nested.required) out.required.add(nReq)
      continue
    }

    const flatName = nameParts.join(delimiter)
    // If property is optional and nullable, strip null from the schema
    const defSchema = (!isReq && nullable) ? withoutNull(propSchema) : propSchema
    out.properties[flatName] = defSchema as JSONSchema7Definition
    if (isReq) out.required.add(flatName)
  }

  return out
}

function tryResolveRootForType(schema: JSONSchema7, typeName: string): JSONSchema7 | undefined {
  if (isObjectSchema(schema)) return schema
  const defs: Record<string, JSONSchema7> | undefined = (schema as any).definitions
  if (defs && defs[typeName] && isObjectSchema(defs[typeName])) return defs[typeName]
  const ref: string | undefined = (schema as any).$ref
  if (ref && ref.startsWith('#/definitions/')) {
    const key = ref.replace('#/definitions/', '')
    if (defs && defs[key] && isObjectSchema(defs[key])) return defs[key]
  }
  const alts: JSONSchema7[] = ((schema as any).anyOf || (schema as any).oneOf || []) as JSONSchema7[]
  for (const alt of alts) {
    const aRef = (alt as any).$ref as string | undefined
    if (aRef && aRef.startsWith('#/definitions/')) {
      const key = aRef.replace('#/definitions/', '')
      if (key === typeName && defs && defs[key] && isObjectSchema(defs[key])) return defs[key]
    }
    if (isObjectSchema(alt)) return alt
  }
  return undefined
}

function inlineRefs<T = JSONSchema7>(node: any, defs?: Record<string, JSONSchema7>): T {
  if (!node || typeof node !== 'object') return node
  if (node.$ref && typeof node.$ref === 'string' && defs) {
    const ref: string = node.$ref
    const key = ref.replace('#/definitions/', '').replace('#/$defs/', '')
    if (key && (defs as any)[key]) {
      const resolved = JSON.parse(JSON.stringify((defs as any)[key]))
      return inlineRefs(resolved, defs)
    }
  }
  if (Array.isArray(node)) return node.map((it) => inlineRefs(it, defs)) as any
  const out: any = Array.isArray(node) ? [] : { ...node }
  for (const [k, v] of Object.entries(node)) {
    if (k === '$ref') continue
    out[k] = inlineRefs(v, defs)
  }
  return out
}

export async function runFlatten(opts: FlattenOpts) {
  const name = opts.name || `${opts.type}Flat`
  const delimiter = opts.delimiter || '_'

  const tsconfig = path.resolve(process.cwd(), 'tsconfig.json')
  const generator = createGenerator({
    path: path.resolve(opts.source),
    tsconfig,
    type: opts.type,
    expose: 'export',
    topRef: false,
    jsDoc: 'extended',
    skipTypeCheck: true,
  } as any)

  const rawSchema = generator.createSchema(opts.type) as JSONSchema7
  const schema = tryResolveRootForType(rawSchema, opts.type)
  if (!schema) throw new Error(`Could not resolve an object schema for type: ${opts.type}`)

  const definitions = (rawSchema as any).definitions || (rawSchema as any).$defs
  const deRefRoot = inlineRefs(schema, definitions)
  const flat = flattenObjectSchema(deRefRoot as JSONSchema7, delimiter)
  // Final sweep: delete any property whose schema still contains only index signatures
  for (const [k, v] of Object.entries(flat.properties)) {
    if (v && typeof v === 'object' && isIndexSignatureOnlyObject(v as JSONSchema7)) delete (flat.properties as any)[k]
  }
  const flatSchema: JSONSchema7 = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: name,
    type: 'object',
    additionalProperties: false,
    properties: flat.properties,
    required: flat.required.size ? Array.from(flat.required) : undefined,
  }

  const ts = await compile(flatSchema, name, {
    bannerComment: '// AUTOGENERATED FILE - DO NOT EDIT',
    style: { singleQuote: true },
    declareExternallyReferenced: false,
    unreachableDefinitions: false,
  })

  const compacted = ts
    .replace(/^(\s*\|)\s*\n\s*\{/gm, '$1 {')
    .replace(/(:)\s*\n(\s*)\|\s*\{/gm, '$1 {')
    .replace(/\}\s*\n(\s*)\]\s*\n\s*\|\s*null/gm, '}[] | null')
    // Prefer Array<{ ... }> over { ... }[] for inline object arrays
    .replace(/:\s*(\{[\s\S]*?\})\s*\[\]/g, (_m, obj) => `: Array<${obj}>`)

  // If the output file already exists, update or append the declaration for `name`
  ensureDir(opts.out)
  const exists = fs.existsSync(opts.out)
  const stripBanner = (s: string) => s.replace(/^\s*\/\/ AUTOGENERATED FILE - DO NOT EDIT\s*\n?/, '')
  const newDecl = stripBanner(compacted).trim() + '\n'

  if (!exists) {
    const header = '// AUTOGENERATED FILE - DO NOT EDIT\n'
    fs.writeFileSync(opts.out, header + newDecl, 'utf8')
    return
  }

  const current = fs.readFileSync(opts.out, 'utf8')
  const typeName = name
  // Remove existing block for the same exported name using a brace-aware scan
  const removeBlock = (content: string, exportedName: string): string => {
    const findStart = (label: string) => content.indexOf(label)
    let start = findStart(`export interface ${exportedName}`)
    let isType = false
    if (start < 0) {
      start = findStart(`export type ${exportedName}`)
      isType = start >= 0
    }
    if (start < 0) return content
    const braceStart = content.indexOf('{', start)
    if (braceStart < 0) return content
    let i = braceStart
    let depth = 0
    while (i < content.length) {
      const ch = content[i]
      if (ch === '{') depth += 1
      else if (ch === '}') {
        depth -= 1
        if (depth === 0) {
          // Include trailing semicolon/newlines
          let end = i + 1
          while (end < content.length && /[\s;\n\r]/.test(content[end])) end += 1
          const before = content.slice(0, start).replace(/\n{3,}/g, '\n\n').trimEnd()
          const after = content.slice(end)
          return (before ? before + '\n\n' : '') + after
        }
      }
      i += 1
    }
    return content
  }

  let stripped = current
  // Remove both interface and type alias forms if present
  stripped = removeBlock(stripped, typeName)
  stripped = removeBlock(stripped, typeName)
  stripped = stripped.replace(/\n{3,}/g, '\n\n').trimEnd()
  // Rebuild file with single header and append updated declaration
  const cleaned = stripped.replace(/^\s*\/\/ AUTOGENERATED FILE - DO NOT EDIT\s*\n?/gm, '').trimEnd()
  const header = '// AUTOGENERATED FILE - DO NOT EDIT\n'
  const updated = header + (cleaned ? cleaned + '\n\n' : '') + newDecl
  fs.writeFileSync(opts.out, updated, 'utf8')
}


