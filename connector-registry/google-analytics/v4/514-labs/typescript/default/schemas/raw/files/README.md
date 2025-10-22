# File schemas

Place file-based schemas here (CSV/JSON/Parquet/Avro/NDJSON). Files in this folder are shown in the Files tab.

Examples:
- `events.csv`
- `events.schema.json` (with title/description)

## OpenAPI type generation

If you have an OpenAPI spec, you can generate TypeScript types and then re-export them from your resource model.

### Recommended: hey-api
```bash
pnpm dlx @hey-api/openapi-ts -i schemas/raw/files/openapi.json -o src/generated
```

After generation, use the generated types by importing them directly (for example, from `src/resources/`).
