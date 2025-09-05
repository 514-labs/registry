import type { Hook } from "../types/hooks";
import type { ConnectorConfig } from "../types/config";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

async function loadSchemaForOperation(op?: string): Promise<any | undefined> {
  if (!op) return undefined;
  const entity = op.split(":")[0];
  const schemaFiles: Record<string, string> = {
    contacts: "raw/endpoints/contacts.schema.json",
    companies: "raw/endpoints/companies.schema.json",
    deals: "raw/endpoints/deals.schema.json",
    tickets: "raw/endpoints/tickets.schema.json",
    engagements: "raw/endpoints/engagements.schema.json",
  };
  const schemaFile = schemaFiles[entity];
  if (!schemaFile) return undefined;
  // Resolve relative to the connector implementation root
  const base = join(process.cwd(), "schemas");
  const path = join(base, schemaFile);
  try {
    const text = await readFile(path, "utf8");
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export function buildValidationHook(config: ConnectorConfig): Hook | undefined {
  if (!config.validation?.enabled) return undefined;
  return {
    name: "schema-validation",
    priority: 100,
    async execute(ctx) {
      if (ctx.type !== "afterResponse" || !ctx.response) return;
      const schema = await loadSchemaForOperation(ctx.operation);
      if (!schema) return;
      const valid = await ajv.validate(schema, ctx.response.data);
      if (!valid) {
        const errText = ajv.errorsText(ajv.errors, { separator: ", " });
        if (config.validation?.strict) {
          throw new Error(`Schema validation failed for ${ctx.operation}: ${errText}`);
        } else {
          // eslint-disable-next-line no-console
          console.warn(`Schema validation issues for ${ctx.operation}: ${errText}`);
        }
      }
    },
  };
}