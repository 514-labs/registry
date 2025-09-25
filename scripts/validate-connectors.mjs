#!/usr/bin/env node
/*
 Minimal connector structure validator.
 - Validates presence of required _meta JSON files and directory shape.
 - Language-agnostic; only enforces TypeScript test presence if package.json has scripts.test.
 - Exits non-zero on violations and prints a concise report.
*/
import { readdirSync, readFileSync, existsSync, statSync } from 'fs'
import { join } from 'path'

const REGISTRY_DIR = join(process.cwd(), 'connector-registry')

function readJsonSafe(fp) {
  try {
    if (!existsSync(fp)) return undefined
    return JSON.parse(readFileSync(fp, 'utf8'))
  } catch {
    return undefined
  }
}

function isDir(p) {
  try { return existsSync(p) && statSync(p).isDirectory() } catch { return false }
}

function listDirs(p) {
  return readdirSync(p, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

function fail(msg, ctx) {
  const line = ctx ? `${msg} :: ${ctx}` : msg
  return { ok: false, msg: line }
}

function ok(msg) { return { ok: true, msg } }

// -----------------------------
// Manual JSON shape assertions
// -----------------------------
function isNonEmptyString(x) { return typeof x === 'string' && x.trim().length > 0 }
function isNonEmptyStringArray(x) { return Array.isArray(x) && x.every(isNonEmptyString) }
function isString(x) { return typeof x === 'string' }
function isStringArray(x) { return Array.isArray(x) && x.every(isString) }

function validateRootMetaShape(meta, ctx, collector) {
  if (!meta || typeof meta !== 'object') {
    collector.errors.push(fail('Root meta must be a JSON object', ctx))
    return
  }
  if (!isNonEmptyString(meta.name)) {
    collector.errors.push(fail('Root meta must include name', ctx))
  }
  if (!isNonEmptyString(meta.identifier)) {
    collector.errors.push(fail('Root meta must include identifier', ctx))
  }
  if (!isNonEmptyString(meta.category)) {
    collector.errors.push(fail('Root meta must include category', ctx))
  }
  if (!isStringArray(meta.tags)) {
    collector.errors.push(fail('Root meta tags must be an array of strings', ctx))
  }
  if (!isNonEmptyString(meta.description)) {
    collector.errors.push(fail('Root meta must include description', ctx))
  }
  if (!isString(meta.homepage)) {
    collector.errors.push(fail('Root meta homepage must be a string', ctx))
  }
}

function validateVersionMetaShape(meta, ctx, folderVersion, collector) {
  if (!meta || typeof meta !== 'object') {
    collector.errors.push(fail('Version meta must be a JSON object', ctx))
    return
  }
  if (!isNonEmptyString(meta.name)) {
    collector.errors.push(fail('Version meta must include name', ctx))
  }
  if (!isNonEmptyString(meta.version)) {
    collector.errors.push(fail('Version meta must include version', ctx))
  } else if (meta.version !== folderVersion) {
    collector.errors.push(fail('Version meta.version mismatch with folder', `${meta.version} != ${folderVersion}`))
  }
  if (!isNonEmptyString(meta.status)) {
    collector.errors.push(fail('Version meta must include status', ctx))
  }
  if (!isString(meta.releasedAt)) {
    collector.infos.push(ok(`Version meta releasedAt must be a string: ${ctx}`))
  }
  if (!isString(meta.notes)) {
    collector.infos.push(ok(`Version meta notes should be a string: ${ctx}`))
  }
}

function validateProviderMetaShape(meta, ctx, folderVersion, folderAuthor, availableLanguages, collector) {
  if (!meta || typeof meta !== 'object') {
    collector.errors.push(fail('Provider meta must be a JSON object', ctx))
    return
  }
  if (!isNonEmptyString(meta.name)) {
    collector.errors.push(fail('Provider meta must include name', ctx))
  }
  if (!isNonEmptyString(meta.author)) {
    collector.errors.push(fail('Provider meta must include author', ctx))
  } else if (meta.author !== folderAuthor) {
    collector.errors.push(fail('Provider meta.author must match folder author', `${meta.author} != ${folderAuthor}`))
  }
  if (!isNonEmptyString(meta.version) || meta.version !== folderVersion) {
    collector.errors.push(fail('Provider meta.version mismatch with folder', `${meta.version} != ${folderVersion}`))
  }
  // category must be a non-empty string
  if (!isNonEmptyString(meta.category)) {
    collector.errors.push(fail('Provider meta category must be a non-empty string', ctx))
  }
  // capabilities must include extract/transform/load booleans
  if (!meta.capabilities || typeof meta.capabilities !== 'object') {
    collector.errors.push(fail('Provider meta capabilities must be an object with extract/transform/load booleans', ctx))
  } else {
    for (const key of ['extract', 'transform', 'load']) {
      if (typeof meta.capabilities[key] !== 'boolean') {
        collector.errors.push(fail(`Provider meta capabilities.${key} must be a boolean`, ctx))
      }
    }
  }
  // source must have type/spec as non-empty strings; homepage may be any string if present
  if (!meta.source || typeof meta.source !== 'object') {
    collector.errors.push(fail('Provider meta source must be an object', ctx))
  } else {
    if (!isNonEmptyString(meta.source.type)) {
      collector.errors.push(fail('Provider meta source.type must be a non-empty string', ctx))
    }
    if (!isNonEmptyString(meta.source.spec)) {
      collector.errors.push(fail('Provider meta source.spec must be a non-empty string', ctx))
    }
    if (!isString(meta.source.homepage)) {
      collector.errors.push(fail('Provider meta source.homepage must be a string if present', ctx))
    }
  }
  if (!isNonEmptyStringArray(meta.languages)) {
    collector.errors.push(fail('Provider meta languages must be an array of strings', ctx))
  }
  if (Array.isArray(meta?.languages)) {
    const missing = meta.languages.filter(l => !availableLanguages.includes(l))
    if (missing.length > 0) {
      collector.errors.push(fail('Provider meta lists languages that do not exist as folders', `${missing.join(', ')} :: ${ctx}`))
    }
  }
  // issues should include an entry for each declared language; if object mapping, it must not be empty
  if (meta.issues && typeof meta.issues === 'object') {
    for (const lang of Array.isArray(meta.languages) ? meta.languages : []) {
      if (!(lang in meta.issues)) {
        collector.errors.push(fail('issues must include an entry for each declared language', `${ctx} :: missing ${lang}`))
        continue
      }
      const mapping = meta.issues[lang]
      if (typeof mapping === 'string') {
        if (!isNonEmptyString(mapping)) {
          collector.errors.push(fail('issues mapping must be a non-empty string URL', `${ctx} :: ${lang}`))
        }
      } else if (mapping && typeof mapping === 'object') {
        const entries = Object.entries(mapping)
        if (entries.length === 0) {
          collector.errors.push(fail('issues mapping object for language must not be empty', `${ctx} :: ${lang}`))
        }
        for (const [implKey, url] of entries) {
          if (!isNonEmptyString(url)) {
            collector.errors.push(fail('issues mapping value must be a non-empty string URL', `${ctx} :: ${lang}.${implKey}`))
          }
        }
      } else {
        collector.errors.push(fail('issues mapping must be string or object', `${ctx} :: ${lang}`))
      }
    }
  }
}

function validateLanguageMetaShape(meta, ctx, expectedAuthor, expectedVersion, expectedLanguage, implDirs, collector) {
  if (!meta || typeof meta !== 'object') {
    collector.errors.push(fail('Language meta must be a JSON object', ctx))
    return
  }
  if (!isNonEmptyString(meta.identifier)) {
    collector.errors.push(fail('Language meta must include identifier', ctx))
  }
  if (!isNonEmptyString(meta.name)) {
    collector.errors.push(fail('Language meta must include name', ctx))
  }
  if (!isNonEmptyString(meta.author) || meta.author !== expectedAuthor) {
    collector.errors.push(fail('Language meta.author must match folder author', `${ctx} :: ${meta.author} != ${expectedAuthor}`))
  }
  if (!isNonEmptyString(meta.version) || meta.version !== expectedVersion) {
    collector.errors.push(fail('Language meta.version must match folder version', `${ctx} :: ${meta.version} != ${expectedVersion}`))
  }
  if (!isNonEmptyString(meta.language) || meta.language !== expectedLanguage) {
    collector.errors.push(fail('Language meta.language must match language folder', `${ctx} :: ${meta.language} != ${expectedLanguage}`))
  }
  if (!isNonEmptyStringArray(meta.implementations)) {
    collector.errors.push(fail('Language meta.implementations must be a non-empty array of strings', ctx))
  } else {
    const dirs = new Set(implDirs)
    const listed = new Set(meta.implementations)
    for (const d of dirs) {
      if (d === '_meta') continue
      if (!listed.has(d)) {
        collector.errors.push(fail('Implementation folder not declared in language meta.implementations', `${ctx} :: ${d}`))
      }
    }
  }
}

function validate() {
  const collector = { errors: [], infos: [] }

  if (!isDir(REGISTRY_DIR)) {
    console.log(`connector-registry not found at ${REGISTRY_DIR}`)
    process.exit(1)
  }

  const connectorIds = listDirs(REGISTRY_DIR)
    .filter(n => !n.startsWith('.') && !n.startsWith('_'))

  for (const cid of connectorIds) {
    if (!/^[A-Za-z0-9_-]+$/.test(cid)) {
      errors.push(fail('Invalid connector id (allowed [A-Za-z0-9_-])', cid))
    }

    const cRoot = join(REGISTRY_DIR, cid)
    const rootMeta = readJsonSafe(join(cRoot, '_meta', 'connector.json'))
    if (!rootMeta) collector.errors.push(fail('Missing _meta/connector.json at connector root', cRoot))
    else validateRootMetaShape(rootMeta, join(cRoot, '_meta', 'connector.json'), collector)

    const versions = listDirs(cRoot).filter(n => n !== '_meta')
    if (versions.length === 0) errors.push(fail('No version folders under connector', cRoot))

    for (const ver of versions) {
      const vPath = join(cRoot, ver)
      const vMeta = readJsonSafe(join(vPath, '_meta', 'version.json'))
      if (!vMeta) collector.errors.push(fail('Missing version _meta/version.json', vPath))
      else validateVersionMetaShape(vMeta, join(vPath, '_meta', 'version.json'), ver, collector)

      const authors = listDirs(vPath).filter(n => !n.startsWith('_') && !n.startsWith('.'))
      if (authors.length === 0) collector.errors.push(fail('No author folders under version', vPath))

      for (const author of authors) {
        const aPath = join(vPath, author)
        const aMetaPath = join(aPath, '_meta', 'connector.json')
        const aMeta = readJsonSafe(aMetaPath)
        if (!aMeta) collector.errors.push(fail('Missing provider _meta/connector.json', aPath))
        const languages = listDirs(aPath).filter(n => !n.startsWith('_') && !n.startsWith('.'))
        if (aMeta) {
          validateProviderMetaShape(aMeta, aMetaPath, ver, author, languages, collector)
        }

        if (languages.length === 0) {
          collector.errors.push(fail('Provider must include at least one language folder', aPath))
        }

        for (const lang of languages) {
          const lPath = join(aPath, lang)
          const impls = listDirs(lPath).filter(n => !n.startsWith('_') && !n.startsWith('.'))
          // Validate language-level meta
          const lMetaPath = join(lPath, '_meta', 'connector.json')
          const lMeta = readJsonSafe(lMetaPath)
          if (!lMeta) {
            collector.errors.push(fail('Missing language _meta/connector.json', lPath))
          } else {
            validateLanguageMetaShape(lMeta, lMetaPath, author, ver, lang, impls, collector)
          }
          // Each language must have at least one implementation folder
          if (impls.length === 0) {
            collector.errors.push(fail('Language must include at least one implementation folder', lPath))
          } else {
            for (const impl of impls) {
              const iPath = join(lPath, impl)
              // TypeScript: if package.json exists and has test script, great. If missing, warn.
              if (lang === 'typescript') {
                const pkg = readJsonSafe(join(iPath, 'package.json'))
                if (!pkg) collector.infos.push(ok(`No package.json in implementation (TS): ${iPath}`))
                else if (!pkg.scripts || !pkg.scripts.test) collector.infos.push(ok(`No test script in package.json (TS): ${iPath}`))
              }
            }
          }
        }
      }
    }
  }

  const errTexts = collector.errors.map(e => `ERROR: ${e.msg}`)
  const infoTexts = collector.infos.map(i => `INFO: ${i.msg}`)
  if (infoTexts.length) console.log(infoTexts.join('\n'))
  if (errTexts.length) {
    console.error(errTexts.join('\n'))
    process.exit(1)
  }
  console.log('Connector registry validation: OK')
}

validate()


