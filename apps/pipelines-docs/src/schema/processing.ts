import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, resolve, basename, dirname } from "path";
import { readConnector } from "@workspace/registry/connectors";

// Types aligned with SchemaDiagram's internal data shapes
export type DiagramColumn = {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  nullable?: boolean;
};

export type DiagramTable = {
  label: string;
  columns: DiagramColumn[];
};

export type DiagramRelationship = {
  sourceTable: string;
  targetTable: string;
  label?: string;
};

export type DiagramEndpointParam = {
  name: string;
  type: string;
  required?: boolean;
  children?: DiagramEndpointParam[];
};

export type DiagramEndpoint = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string;
  path: string;
  title: string;
  summary?: string;
  params?: DiagramEndpointParam[];
  // Folders derived from the registry schema file path (e.g., raw/endpoints/reports/run.schema.json -> ["reports"])
  // Used purely for grouping in the UI; optional for backward compatibility
  folders?: string[];
};

export type DiagramFile = {
  name: string;
  format: "csv" | "json" | "parquet" | "avro" | "ndjson" | string;
  details?: string;
};

export type DiagramDatabase = {
  tables: DiagramTable[];
  relationships: DiagramRelationship[];
};

export type DiagramSchema = {
  database: DiagramDatabase;
  endpoints: DiagramEndpoint[];
  files: DiagramFile[];
  errors?: string[];
};

type Json = any;

function readJsonSafe<T = Json>(
  filePath: string,
  errors?: string[]
): T | undefined {
  try {
    if (!existsSync(filePath)) return undefined;
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    if (errors) errors.push(`Failed to parse JSON: ${filePath}`);
    return undefined;
  }
}

function listFilesRecursively(
  dir: string,
  predicate?: (p: string) => boolean
): string[] {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listFilesRecursively(full, predicate));
    else if (!predicate || predicate(full)) out.push(full);
  }
  return out;
}

// ---------- Relational tables ----------
function normalizeTablesFromTablesJson(
  tablesJson: { tables?: Array<any> } | undefined
): DiagramTable[] {
  if (!tablesJson?.tables || !Array.isArray(tablesJson.tables)) return [];
  return tablesJson.tables.map((t) => {
    const primaryKeys: string[] = Array.isArray(t.primaryKey)
      ? t.primaryKey
      : [];
    const columns: DiagramColumn[] = Array.isArray(t.columns)
      ? t.columns.map((c: any) => ({
          name: String(c.name ?? "column"),
          type: String(c.type ?? "unknown"),
          nullable: Boolean(c.nullable ?? false),
          isPrimaryKey: primaryKeys.includes(c.name),
          isForeignKey: Boolean(c.isForeignKey ?? false),
        }))
      : [];
    return { label: String(t.name ?? "table"), columns };
  });
}

function loadRelationalTables(
  schemasDir: string,
  indexJson: any | undefined,
  errors?: string[]
): DiagramTable[] {
  const tables: DiagramTable[] = [];
  const seenPaths = new Set<string>();
  const seenTableNames = new Set<string>();

  const addFromPath = (filePath: string) => {
    if (seenPaths.has(filePath)) return;
    seenPaths.add(filePath);
    const data = readJsonSafe<{ tables?: any[] }>(filePath);
    if (!data) return;
    for (const t of normalizeTablesFromTablesJson(data)) {
      if (seenTableNames.has(t.label)) continue;
      seenTableNames.add(t.label);
      tables.push(t);
    }
  };

  // GA4-like index.json: datasets with kind === "relational" and a path to tables.json
  const datasets: Array<any> = Array.isArray(indexJson?.datasets)
    ? indexJson.datasets
    : [];
  for (const ds of datasets) {
    if (
      (ds.kind === "relational" || ds.kind === "tables") &&
      typeof ds.path === "string"
    ) {
      const path = join(schemasDir, ds.path);
      const prevCount: number = tables.length;
      addFromPath(path);
      if (tables.length === prevCount) {
        // likely invalid or duplicate
        const data = readJsonSafe<any>(path, errors);
        if (!data)
          errors?.push(`Missing or invalid relational tables file: ${path}`);
      }
    }
  }

  // HubSpot-like index.json: entities[].raw.relational pointing to tables.json
  const entities: Array<any> = Array.isArray(indexJson?.entities)
    ? indexJson.entities
    : [];
  for (const ent of entities) {
    const relPath: string | undefined = ent?.raw?.relational;
    if (typeof relPath === "string") {
      const path = join(schemasDir, relPath);
      const prevCount: number = tables.length;
      addFromPath(path);
      if (tables.length === prevCount) {
        const data = readJsonSafe<any>(path, errors);
        if (!data)
          errors?.push(`Missing or invalid relational tables file: ${path}`);
      }
    }
  }

  // Fallback: look for any tables.json within schemas/**/relational/
  if (tables.length === 0 && existsSync(schemasDir)) {
    const candidates = listFilesRecursively(schemasDir, (p) =>
      /relational\/tables\.json$/i.test(p)
    );
    for (const fp of candidates) {
      const prevCount: number = tables.length;
      addFromPath(fp);
      if (tables.length === prevCount) {
        const data = readJsonSafe<any>(fp, errors);
        if (!data)
          errors?.push(`Missing or invalid relational tables file: ${fp}`);
      }
    }
  }

  return tables;
}

// ---------- Endpoints ----------
function refName(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  const hashIndex = ref.indexOf("#");
  const after = hashIndex >= 0 ? ref.slice(hashIndex + 1) : ref;
  const parts = after.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

function schemaTypeToString(schema: any): string {
  if (!schema) return "unknown";
  if (schema.$ref) return refName(schema.$ref) ?? "ref";
  const t = schema.type;
  if (t === "array") {
    const item = schema.items ?? {};
    const it = item.$ref
      ? (refName(item.$ref) ?? "ref")
      : (item.type ?? "unknown");
    return `array<${it}>`;
  }
  if (t === "object") return "object";
  if (typeof t === "string") return t;
  if (Array.isArray(t)) return t.join("|");
  return "unknown";
}

function buildParamsFromJsonSchema(
  schema: any,
  depth: number = 0
): DiagramEndpointParam[] {
  if (!schema || typeof schema !== "object") return [];
  const properties = schema.properties || {};
  const requiredList: string[] = Array.isArray(schema.required)
    ? schema.required
    : [];
  const params: DiagramEndpointParam[] = [];
  for (const key of Object.keys(properties)) {
    const prop = properties[key] || {};
    const param: DiagramEndpointParam = {
      name: key,
      type: schemaTypeToString(prop),
      required: requiredList.includes(key) || undefined,
    };
    // Recurse one level into objects for readability
    if (prop && (prop.type === "object" || prop.properties) && depth < 2) {
      const childParams = buildParamsFromJsonSchema(prop, depth + 1);
      if (childParams.length > 0) param.children = childParams;
    }
    params.push(param);
  }
  return params;
}

function loadEndpoints(
  schemasDir: string,
  indexJson: any | undefined,
  errors?: string[]
): DiagramEndpoint[] {
  const endpoints: DiagramEndpoint[] = [];

  function deriveFoldersFromRelativePath(
    relativePath: string | undefined
  ): string[] {
    if (!relativePath || typeof relativePath !== "string") return [];
    const dir = dirname(relativePath).replace(/\\/g, "/");
    const parts = dir.split("/").filter(Boolean);
    // Drop top-level stage folder like "raw" or "extracted"
    const stageDropped =
      parts[0] === "raw" || parts[0] === "extracted" ? parts.slice(1) : parts;
    // Drop the "endpoints" segment if present
    const idx = stageDropped.indexOf("endpoints");
    const afterEndpoints =
      idx >= 0 ? stageDropped.slice(idx + 1) : stageDropped;
    return afterEndpoints;
  }

  // GA4-like datasets entries for endpoints
  const datasets: Array<any> = Array.isArray(indexJson?.datasets)
    ? indexJson.datasets
    : [];
  for (const ds of datasets) {
    if (ds.kind === "endpoints" && typeof ds.path === "string") {
      const fp = join(schemasDir, ds.path);
      const json = readJsonSafe<any>(fp, errors);
      if (!json) continue;

      const meta = json.metadata || ds.metadata || {};
      const method = (meta.httpMethod || meta.apiMethod || "GET") as string;
      const path = (meta.apiPath ||
        meta.path ||
        ds.name ||
        basename(fp)) as string;
      const title = (json.title ||
        ds.name ||
        basename(fp).replace(/\.(schema\.)?json$/i, "")) as string;
      const summary = (json.description || undefined) as string | undefined;

      const requestSchema =
        json.properties?.request ?? json.request ?? undefined;
      const params = requestSchema
        ? buildParamsFromJsonSchema(requestSchema)
        : undefined;

      const folders = deriveFoldersFromRelativePath(ds.path);

      endpoints.push({ method, path, title, summary, params, folders });
    }
  }

  // HubSpot-like: treat raw JSON entity schemas as endpoints
  const entities: Array<any> = Array.isArray(indexJson?.entities)
    ? indexJson.entities
    : [];
  for (const ent of entities) {
    const jsonPath: string | undefined = ent?.raw?.json;
    if (typeof jsonPath === "string") {
      const fp = join(schemasDir, jsonPath);
      const json = readJsonSafe<any>(fp, errors);
      const title = (json?.title || ent?.name || basename(fp)) as string;
      const summary = (json?.description || undefined) as string | undefined;
      const method = "GET";
      const path = `/raw/${ent?.name || basename(fp).replace(/\.schema\.json$/i, "")}`;
      const params = buildParamsFromJsonSchema(json);
      const folders = deriveFoldersFromRelativePath(jsonPath);
      endpoints.push({ method, path, title, summary, params, folders });
    }
  }

  return endpoints;
}

// ---------- Files (JSON/CSV) ----------
function loadFileSchemas(
  schemasDir: string,
  _indexJson: any | undefined,
  errors?: string[]
): DiagramFile[] {
  const files: DiagramFile[] = [];

  // New rule: only treat schemas under schemas/files as Files.
  const filesDir = join(schemasDir, "files");
  if (!existsSync(filesDir) || !statSync(filesDir).isDirectory()) {
    return files;
  }

  const candidates = listFilesRecursively(filesDir, (p) =>
    /(\.schema\.json$|\.json$|\.csv$|\.parquet$|\.avro$|\.ndjson$)/i.test(p)
  );

  for (const fp of candidates) {
    const name = basename(fp);
    const lower = name.toLowerCase();
    let format: DiagramFile["format"] = "json";
    if (lower.endsWith(".csv") || lower.includes("csv")) format = "csv";
    else if (lower.endsWith(".parquet") || lower.includes("parquet"))
      format = "parquet";
    else if (lower.endsWith(".avro") || lower.includes("avro")) format = "avro";
    else if (
      lower.endsWith(".ndjson") ||
      lower.includes("ndjson") ||
      lower.includes("jsonl")
    )
      format = "ndjson";

    let details: string | undefined = undefined;
    if (/\.json$/i.test(lower)) {
      const schema = readJsonSafe<any>(fp, errors);
      details =
        (schema?.title as string | undefined) ??
        (schema?.description as string | undefined);
    }

    files.push({ name, format, details });
  }

  return files;
}

// ---------- Shopify Python fallback ----------
function loadShopifyModelsAsFiles(implPath: string): DiagramFile[] {
  // Look for a models.py somewhere under src/**/data/models.py
  const srcDir = join(implPath, "src");
  if (!existsSync(srcDir)) return [];
  const candidateFiles = listFilesRecursively(srcDir, (p) =>
    /data\/models\.py$/i.test(p)
  );
  const files: DiagramFile[] = [];
  for (const f of candidateFiles) {
    try {
      const raw = readFileSync(f, "utf-8");
      const classRegex = /^class\s+(\w+)\s*\(\s*\w*BaseModel\w*\s*\)\s*:/gm;
      const seen = new Set<string>();
      let m: RegExpExecArray | null;
      while ((m = classRegex.exec(raw))) {
        const className = m[1];
        if (!seen.has(className)) {
          seen.add(className);
          files.push({
            name: `${className}.json`,
            format: "json",
            details: `Pydantic model ${className}`,
          });
        }
      }
    } catch {
      // ignore
    }
  }
  return files;
}

// ---------- Entry point ----------
export function loadDiagramSchemaForImplementation(
  implementationPath: string
): DiagramSchema {
  const implPath = resolve(implementationPath);
  const schemasDir = join(implPath, "schemas");

  const errors: string[] = [];
  let indexJson: any | undefined = undefined;
  if (existsSync(schemasDir)) {
    const indexPath = join(schemasDir, "index.json");
    indexJson = readJsonSafe<any>(indexPath, errors);
    if (!indexJson)
      errors.push(`Missing or invalid schema index: ${indexPath}`);
  }

  const databaseTables = loadRelationalTables(schemasDir, indexJson, errors);
  const endpoints = loadEndpoints(schemasDir, indexJson, errors);
  let files = loadFileSchemas(schemasDir, indexJson, errors);

  // Shopify Python fallback when no schemas directory exists
  if (
    !existsSync(schemasDir) ||
    (!indexJson && files.length === 0 && databaseTables.length === 0)
  ) {
    files = loadShopifyModelsAsFiles(implPath);
  }

  const database: DiagramDatabase = {
    tables: databaseTables,
    relationships: [], // Relationships are optional; most examples lack FK metadata
  };

  return {
    database,
    endpoints,
    files,
    errors: errors.length ? errors : undefined,
  };
}

// Convenience helper: discover the best implementation path from a provider entry
export function guessSchemasDirFromImplementationPath(
  implementationPath: string
): string | null {
  const implPath = resolve(implementationPath);
  const schemasDir = join(implPath, "schemas");
  return existsSync(schemasDir) ? schemasDir : null;
}

// Convenience helper: build minimal inputs for SchemaDiagram from a provider implementation path
export function getSchemaDiagramInputs(implementationPath: string): {
  database: { tables: DiagramTable[] };
  endpoints: DiagramEndpoint[];
  files: DiagramFile[];
  errors?: string[];
} {
  const schema = loadDiagramSchemaForImplementation(implementationPath);
  return {
    database: { tables: schema.database.tables },
    endpoints: schema.endpoints,
    files: schema.files,
    errors: schema.errors,
  };
}

// ---------- Pipeline Lineage (lineage/schemas) ----------

type LineagePointerDataset = {
  kind: "pointer";
  name?: string;
  connector?: {
    name: string;
    version?: string;
    author?: string;
    language?: string;
    implementation?: string;
  };
};

function isPointerDataset(x: any): x is LineagePointerDataset {
  return (
    x &&
    x.kind === "pointer" &&
    x.connector &&
    typeof x.connector.name === "string"
  );
}

function mergeUniqueTables(target: DiagramTable[], add: DiagramTable[]) {
  const seen = new Set(target.map((t) => t.label));
  for (const t of add)
    if (!seen.has(t.label)) {
      seen.add(t.label);
      target.push(t);
    }
}

function mergeEndpoints(target: DiagramEndpoint[], add: DiagramEndpoint[]) {
  const seen = new Set(
    target.map((e) => `${String(e.method).toUpperCase()} ${e.path}`)
  );
  for (const e of add) {
    const key = `${String(e.method).toUpperCase()} ${e.path}`;
    if (!seen.has(key)) {
      seen.add(key);
      target.push(e);
    }
  }
}

function mergeFiles(target: DiagramFile[], add: DiagramFile[]) {
  const seen = new Set(target.map((f) => `${f.name}|${String(f.format)}`));
  for (const f of add) {
    const key = `${f.name}|${String(f.format)}`;
    if (!seen.has(key)) {
      seen.add(key);
      target.push(f);
    }
  }
}

export function getPipelineLineageDiagramInputs(implementationPath: string): {
  database: { tables: DiagramTable[] };
  endpoints: DiagramEndpoint[];
  files: DiagramFile[];
  errors?: string[];
} {
  const implPath = resolve(implementationPath);
  const lineageDir = join(implPath, "lineage");
  const schemasDir = join(lineageDir, "schemas");

  // Fallback: if lineage folder is missing, reuse regular schemas
  if (!existsSync(schemasDir)) {
    return getSchemaDiagramInputs(implementationPath);
  }

  const errors: string[] = [];
  const indexPath = join(schemasDir, "index.json");
  const indexJson = readJsonSafe<any>(indexPath, errors);
  if (!indexJson)
    errors.push(`Missing or invalid lineage schema index: ${indexPath}`);

  // Load local lineage-defined schemas
  const tables = loadRelationalTables(schemasDir, indexJson, errors);
  const endpoints = loadEndpoints(schemasDir, indexJson, errors);
  let files = loadFileSchemas(schemasDir, indexJson, errors);

  // Manifest support: lineage/schemas/files/manifest.json can enumerate file outputs
  try {
    const manifestPath = join(schemasDir, "files", "manifest.json");
    const manifest = readJsonSafe<any>(manifestPath);
    if (manifest && Array.isArray(manifest.files)) {
      const extras: DiagramFile[] = manifest.files.map((it: any) => {
        if (typeof it === "string") {
          const name = basename(String(it));
          const lower = name.toLowerCase();
          let format: DiagramFile["format"] = "json";
          if (lower.endsWith(".csv") || lower.includes("csv")) format = "csv";
          else if (lower.endsWith(".parquet") || lower.includes("parquet"))
            format = "parquet";
          else if (lower.endsWith(".avro") || lower.includes("avro"))
            format = "avro";
          else if (
            lower.endsWith(".ndjson") ||
            lower.includes("ndjson") ||
            lower.includes("jsonl")
          )
            format = "ndjson";
          return { name, format } as DiagramFile;
        }
        const name: string = String(
          it?.name ?? basename(String(it?.path ?? "file"))
        );
        const raw: string =
          `${it?.format ?? it?.path ?? it?.name ?? "json"}`.toLowerCase();
        let format: DiagramFile["format"] = "json";
        if (raw.includes("csv")) format = "csv";
        else if (raw.includes("parquet")) format = "parquet";
        else if (raw.includes("avro")) format = "avro";
        else if (raw.includes("ndjson") || raw.includes("jsonl"))
          format = "ndjson";
        const details: string | undefined = it?.details
          ? String(it.details)
          : undefined;
        return { name, format, details } as DiagramFile;
      });
      mergeFiles(files, extras);
    }
  } catch {
    // ignore
  }

  // Process pointer datasets to include connector schemas
  const datasets: Array<any> = Array.isArray(indexJson?.datasets)
    ? indexJson.datasets
    : [];
  for (const ds of datasets) {
    if (!isPointerDataset(ds)) continue;
    const c = ds.connector!;
    try {
      const conn = readConnector(c.name);
      if (!conn) {
        errors.push(`Pointer: connector '${c.name}' not found`);
        continue;
      }
      // Choose provider by version/author, or first available
      const provider =
        conn.providers.find((p) => {
          const v = p.path.split("/").slice(-2)[0];
          const vOk = c.version ? v === c.version : true;
          const aOk = c.author ? p.authorId === c.author : true;
          return vOk && aOk;
        }) || conn.providers[0];
      if (!provider) {
        errors.push(`Pointer: no providers for connector '${c.name}'`);
        continue;
      }
      // Choose implementation by language/name or first
      const impl =
        provider.implementations.find((i) => {
          const lOk = c.language ? i.language === c.language : true;
          const imOk = c.implementation
            ? i.implementation === c.implementation
            : true;
          return lOk && imOk;
        }) || provider.implementations[0];
      if (!impl) {
        errors.push(`Pointer: no implementations for connector '${c.name}'`);
        continue;
      }
      const schema = loadDiagramSchemaForImplementation(impl.path);
      mergeUniqueTables(tables, schema.database.tables);
      mergeEndpoints(endpoints, schema.endpoints);
      mergeFiles(files, schema.files);
    } catch {
      errors.push(`Pointer: failed to load connector '${c.name}'`);
    }
  }

  return {
    database: { tables },
    endpoints,
    files,
    errors: errors.length ? errors : undefined,
  };
}

// ---------- Moose-native lineage manifest (static graph, no runs) ----------

import type {
  MooseLineageManifest,
  MooseLineageNode,
  MooseLineageEdge,
} from "@workspace/models";

// local aliases remain the same via import types above

export type UiLineageNode = {
  id: string;
  kind: string; // same as manifest node.type
  title: string; // human display
  subtitle?: string; // e.g., namespace or version
  raw?: MooseLineageNode;
};

export type UiLineageEdge = {
  id: string;
  from: string;
  to: string;
  kind: string; // same as manifest edge.type
  label?: string; // display label
  raw?: MooseLineageEdge;
};

function tryReadFirstExistingJson<T = any>(
  paths: string[],
  errors?: string[]
): T | null {
  for (const p of paths) {
    try {
      if (existsSync(p)) {
        const raw = readFileSync(p, "utf-8");
        return JSON.parse(raw) as T;
      }
    } catch {
      errors?.push(`Failed to parse JSON: ${p}`);
    }
  }
  return null;
}

export function loadMooseLineageManifest(implementationPath: string): {
  manifest: MooseLineageManifest | null;
  errors?: string[];
} {
  const implPath = resolve(implementationPath);
  const candidates = [
    join(implPath, "moose", "lineage.manifest.json"),
    join(implPath, "lineage", "manifest.json"),
    join(implPath, "lineage", "lineage.manifest.json"),
  ];
  const errors: string[] = [];
  const manifest = tryReadFirstExistingJson<MooseLineageManifest>(
    candidates,
    errors
  );
  return { manifest, errors: errors.length ? errors : undefined };
}

export function getMooseLineageGraph(
  implementationPath: string
): { nodes: UiLineageNode[]; edges: UiLineageEdge[] } | null {
  const { manifest } = loadMooseLineageManifest(implementationPath);
  if (
    !manifest ||
    !Array.isArray(manifest.nodes) ||
    !Array.isArray(manifest.edges)
  ) {
    return null;
  }

  const nodes: UiLineageNode[] = manifest.nodes.map((n: MooseLineageNode) => ({
    id: n.id,
    kind: n.type,
    title: n.name || n.id,
    subtitle: `${n.namespace}${n.version ? ` • v${n.version}` : ""}`,
    raw: n,
  }));

  const edges: UiLineageEdge[] = manifest.edges.map(
    (e: MooseLineageEdge, idx: number) => ({
      id: `${e.from}__${e.type}__${e.to}__${idx}`,
      from: e.from,
      to: e.to,
      kind: e.type,
      label: e.type,
      raw: e,
    })
  );

  return { nodes, edges };
}
