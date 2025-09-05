#!/usr/bin/env node
import { generateTypesForWorkspace } from '../lib/generate.js'

async function main() {
  const root = process.cwd()
  const out = process.env.SCHEMA_TYPES_OUT_DIR || 'generated-types'
  const mode = (process.env.SCHEMA_TYPES_MODE as 'ts' | 'dts') || 'ts'
  await generateTypesForWorkspace({ root, outDir: out, mode })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})