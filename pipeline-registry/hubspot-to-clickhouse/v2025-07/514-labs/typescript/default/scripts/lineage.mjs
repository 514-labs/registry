import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

const providerMetaDir = path.resolve(process.cwd(), '../../_meta')
const assetsDir = path.join(providerMetaDir, 'assets')
const pipelineJsonPath = path.join(providerMetaDir, 'pipeline.json')
const mmdPath = path.join(assetsDir, 'lineage.mmd')
const svgPath = path.join(assetsDir, 'lineage.svg')

function shapeFor(kind) {
  if (kind === 'source') return '([%LABEL%])'
  if (kind === 'transform') return '{{%LABEL%}}'
  return '[(%LABEL%)]' // system and destination
}

function labelForDestination(dest) {
  if (!dest) return 'Destination'
  const parts = [dest.system || 'dest']
  if (dest.database) parts.push(dest.database)
  if (dest.table) parts[parts.length - 1] += `.${dest.table}`
  return parts.join(' ')
}

function deriveFromSpec(spec) {
  const nodes = []
  const edges = []
  const sourceId = 'source'
  nodes.push({ id: sourceId, kind: 'source', label: spec?.source?.connector?.name || spec?.source?.type || 'source' })
  const systemIds = []
  for (let i = 0; i < (spec.systems?.length || 0); i++) {
    const sys = spec.systems[i]
    const id = sys.id || `system_${i + 1}`
    nodes.push({ id, kind: 'system', label: sys.label || sys.type || id })
    systemIds.push(id)
  }
  const transformIds = []
  for (let i = 0; i < (spec.transformations?.length || 0); i++) {
    const t = spec.transformations[i]
    const id = t.id || `transform_${i + 1}`
    nodes.push({ id, kind: 'transform', label: t.label || t.type || id })
    transformIds.push(id)
  }
  const destId = 'dest'
  nodes.push({ id: destId, kind: 'destination', label: labelForDestination(spec.destination) })
  // Chain: source -> systems -> transforms -> dest
  let prev = sourceId
  const chain = [...systemIds, ...transformIds, destId]
  for (const next of chain) { edges.push({ from: prev, to: next }) ; prev = next }
  return { nodes, edges }
}

function toMermaid(lineage) {
  const lines = ['flowchart TD']
  for (const n of lineage.nodes) {
    const shape = shapeFor(n.kind)
    const safeLabel = (n.label || n.id).replace(/\n/g, ' ')
    lines.push(`  ${n.id}${shape.replace('%LABEL%', safeLabel)}`)
  }
  for (const e of lineage.edges) {
    const lbl = e.label ? `|${e.label}|` : ''
    lines.push(`  ${e.from} -->${lbl} ${e.to}`)
  }
  return lines.join('\n') + '\n'
}

async function main() {
  await mkdir(assetsDir, { recursive: true })
  const raw = await readFile(pipelineJsonPath, 'utf8')
  const spec = JSON.parse(raw)
  const lineage = (spec.lineage && spec.lineage.nodes?.length) ? spec.lineage : deriveFromSpec(spec)
  const mermaid = toMermaid(lineage)
  await writeFile(mmdPath, mermaid, 'utf8')
  if (process.argv.includes('--svg')) {
    await new Promise((resolve) => {
      const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['-y', '-p', '@mermaid-js/mermaid-cli', 'mmdc', '-i', mmdPath, '-o', svgPath], { stdio: 'inherit' })
      child.on('exit', () => resolve())
    })
  }
  console.log('Wrote', mmdPath, process.argv.includes('--svg') ? 'and SVG' : '')
}

main().catch((err) => { console.error(err); process.exit(1) })
