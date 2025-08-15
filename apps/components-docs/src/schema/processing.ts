import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, resolve, basename, dirname } from "path";

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

      endpoints.push({ method, path, title, summary, params });
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
      endpoints.push({ method, path, title, summary, params });
    }
  }

  return endpoints;
}

// ---------- Files (JSON/CSV) ----------
function loadFileSchemas(
  schemasDir: string,
  indexJson: any | undefined,
  errors?: string[]
): DiagramFile[] {
  const files: DiagramFile[] = [];

  // HubSpot-like JSON entities are now represented as endpoints, not files.

  // GA4-like: types under endpoints/types/*.schema.json → treat as files
  const datasets: Array<any> = Array.isArray(indexJson?.datasets)
    ? indexJson.datasets
    : [];
  for (const ds of datasets) {
    if (ds.kind === "endpoints" && typeof ds.path === "string") {
      const isType = (ds.metadata?.category ?? "").toLowerCase() === "type";
      if (isType) {
        const fp = join(schemasDir, ds.path);
        const name = basename(fp);
        const schema = readJsonSafe<any>(fp, errors);
        const title = schema?.title as string | undefined;
        files.push({ name, format: "json", details: title });
      }
    }
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
