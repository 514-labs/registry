import fs from 'node:fs/promises'
import path from 'node:path'
import prompts from 'prompts'
import kleur from 'kleur'

export type Kind = 'connector' | 'pipeline'
export type Language = 'typescript' | 'python' | 'meta'

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function findRepoRoot(startDir: string): Promise<string> {
  let dir = path.resolve(startDir)
  while (true) {
    const ws = path.join(dir, 'pnpm-workspace.yaml')
    const hasWorkspace = await pathExists(ws)
    const hasRegistries = await pathExists(path.join(dir, 'connector-registry'))
    if (hasWorkspace || hasRegistries) return dir
    const parent = path.dirname(dir)
    if (parent === dir) return startDir
    dir = parent
  }
}

function assertPattern(value: string | undefined, pattern: string, label: string): string {
  if (!value) throw new Error(`${label} is required`)
  const re = new RegExp(pattern)
  if (!re.test(value)) throw new Error(`${label} does not match pattern ${pattern}: ${value}`)
  return value
}

function replaceTemplatePlaceholders(input: string, values: Record<string, string>): string {
  return input.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '')
}

type StructureNode =
  | { type: 'dir'; name: string; children?: StructureNode[] }
  | { type: 'file'; name: string; template?: string }

type ScaffoldFile = {
  $schema?: string
  scaffold: string
  version: string
  description?: string
  variables: Record<string, { description?: string; example?: string; pattern?: string; default?: string }>
  structure: StructureNode[]
}

type PromptObject = { [key: string]: any }

async function readJson(file: string): Promise<any> {
  const buf = await fs.readFile(file, 'utf8')
  return JSON.parse(buf)
}

function getScaffoldPath(repoRoot: string, kind: Kind, language: Language): string {
  const base = language === 'meta' ? 'meta' : language
  const registryDir = kind === 'connector' ? 'connector-registry' : 'pipeline-registry'
  const filename = base === 'meta' ? 'meta.json' : `${base}.json`
  return path.join(repoRoot, registryDir, '_scaffold', filename)
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true })
}

async function writeFile(p: string, content: string) {
  await ensureDir(path.dirname(p))
  await fs.writeFile(p, content, 'utf8')
}

async function applyStructure(targetRoot: string, nodes: StructureNode[], vars: Record<string, string>, dryRun: boolean, log: string[] = [], rel = '.') {
  for (const node of nodes) {
    const name = replaceTemplatePlaceholders(node.name, vars)
    const currentPath = path.join(targetRoot, name)
    const relPath = path.posix.join(rel, name.replaceAll('\\', '/'))
    if (node.type === 'dir') {
      log.push(kleur.cyan(`mkdir ${relPath}/`))
      if (!dryRun) await ensureDir(currentPath)
      if (node.children?.length) await applyStructure(currentPath, node.children, vars, dryRun, log, relPath)
    } else if (node.type === 'file') {
      const content = replaceTemplatePlaceholders(node.template ?? '', vars)
      log.push(kleur.green(`write ${relPath}`))
      if (!dryRun) await writeFile(currentPath, content)
    }
  }
}

function suggestPackageName(kind: Kind, language: Language, id: string): string {
  if (language === 'python') return `${kind}_${id.replaceAll('-', '_')}`
  return `@workspace/${kind}-${id}`
}

export async function runScaffold({ kind, language, options }: { kind: Kind; language: Language; options: any }) {
  const repoRoot = await findRepoRoot(process.cwd())
  const scaffoldPath = getScaffoldPath(repoRoot, kind, language)
  const scaffold: ScaffoldFile = await readJson(scaffoldPath)

  const varsSpec = scaffold.variables
  const ask = async () => {
    const questions: PromptObject[] = []
    const pushQ = (name: string, message: string, initial?: string) => {
      questions.push({ type: 'text', name, message, initial })
    }

    if (kind === 'connector') {
      pushQ('connector', 'Connector id (kebab-case)', options.name)
    } else {
      pushQ('pipeline', 'Pipeline id (kebab-case)', options.name)
    }
    pushQ('version', 'Version (e.g. v1, ga4, 2024-10-01)', options.scaffoldVersion ?? options.version)
    pushQ('author', 'Author org/user (kebab-case)', options.author)

    if (language !== 'meta') {
      pushQ('implementation', `Implementation (default: ${varsSpec.implementation?.default ?? 'default'})`, options.implementation ?? varsSpec.implementation?.default ?? 'default')
      pushQ('packageName', 'Package name (npm or python)', options.packageName)
      pushQ('resource', `Default resource (kebab-case)`, options.resource ?? 'resource')
    }

    const answers = options.yes ? {
      connector: options.name,
      pipeline: options.name,
      version: options.scaffoldVersion ?? options.version,
      author: options.author,
      implementation: options.implementation ?? varsSpec.implementation?.default ?? 'default',
      packageName: options.packageName,
      resource: options.resource ?? 'resource',
    } : await prompts(questions, { onCancel: () => { throw new Error('Cancelled') } })

    return answers
  }

  const answers = await ask()

  const idKey = kind === 'connector' ? 'connector' : 'pipeline'
  const id = answers[idKey]

  // validations
  const idPattern = varsSpec[idKey]?.pattern ?? '^[a-z0-9][a-z0-9-]*$'
  assertPattern(id, idPattern, `${kind} id`)
  assertPattern(answers.version, varsSpec.version?.pattern ?? '^[A-Za-z0-9][A-Za-z0-9._-]*$', 'version')
  assertPattern(answers.author, varsSpec.author?.pattern ?? '^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$', 'author')
  if (language !== 'meta') {
    assertPattern(answers.implementation, varsSpec.implementation?.pattern ?? '^[a-z0-9][a-z0-9-]*$', 'implementation')
    if (!answers.packageName) answers.packageName = suggestPackageName(kind, language, id)
    if (language === 'typescript') {
      const npmPattern = varsSpec.packageName?.pattern ?? '^[a-z0-9-~][a-z0-9-._~]*$'
      assertPattern(answers.packageName, npmPattern, 'packageName')
    } else if (language === 'python') {
      const pyPattern = varsSpec.packageName?.pattern ?? '^[a-z_][a-z0-9_]*$'
      assertPattern(answers.packageName, pyPattern, 'packageName')
    }
    assertPattern(answers.resource, varsSpec.resource?.pattern ?? '^[a-z0-9][a-z0-9-]*$', 'resource')
  }

  const vars: Record<string, string> = {
    connector: kind === 'connector' ? id : '',
    pipeline: kind === 'pipeline' ? id : '',
    version: answers.version,
    author: answers.author,
    implementation: answers.implementation ?? '',
    packageName: answers.packageName ?? '',
    resource: answers.resource ?? '',
  }

  const targetRoot = path.join(repoRoot, kind === 'connector' ? 'connector-registry' : 'pipeline-registry')
  const ops: string[] = []
  await applyStructure(targetRoot, scaffold.structure, vars, Boolean(options.dryRun), ops)

  const headline = options.dryRun ? kleur.yellow('Dry run: no files written') : kleur.green('Scaffold created')
  console.log(headline)
  for (const op of ops) console.log('  ' + op)

  // Next steps
  console.log('\nNext steps:')
  if (language === 'meta') {
    console.log(`- Add a language implementation later with: factory scaffold ${kind} typescript --name ${id} --version ${answers.version} --author ${answers.author}`)
  } else if (language === 'typescript') {
    console.log(`- Install deps in the new package (if needed): pnpm -F ${answers.packageName} install`)
    console.log(`- Build TypeScript: pnpm -F ${answers.packageName} build`)
    console.log(`- Start implementing in src/ under ${kind}/${id}/${answers.version}/${answers.author}/typescript/${answers.implementation}`)
  } else if (language === 'python') {
    console.log(`- Create a venv and install: cd to the impl dir and pip install -e .`)
    console.log(`- Start implementing in src/ under ${kind}/${id}/${answers.version}/${answers.author}/python/${answers.implementation}`)
  }
}

