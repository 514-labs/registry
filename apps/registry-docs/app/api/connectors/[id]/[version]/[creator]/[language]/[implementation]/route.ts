import { NextResponse } from "next/server";
import { readConnector, listConnectorIds } from "@workspace/registry/connectors";
import { getIssuePositiveReactionsCountFromMeta } from "@workspace/registry";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { getSchemaDiagramInputs } from "@/src/schema/processing";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = {
  id: string;
  version: string;
  creator: string;
  language: string;
  implementation: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const id of listConnectorIds()) {
    const conn = readConnector(id);
    if (!conn) continue;
    for (const provider of conn.providers) {
      const version = provider.path.split("/").slice(-2)[0];
      for (const impl of provider.implementations) {
        params.push({
          id,
          version,
          creator: provider.authorId,
          language: impl.language,
          implementation: impl.implementation ?? "default",
        });
      }
    }
  }
  return params;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id, version, creator, language, implementation } = await params;

  const connector = readConnector(id);
  if (!connector) {
    return NextResponse.json(
      { error: "Connector not found" },
      { status: 404 }
    );
  }

  // Find the specific provider
  const provider = connector.providers.find((p) => {
    const pVersion = p.path.split("/").slice(-2)[0];
    return p.authorId === creator && pVersion === version;
  });

  if (!provider) {
    return NextResponse.json(
      { error: "Provider not found" },
      { status: 404 }
    );
  }

  // Find the specific implementation
  const implEntry =
    provider.implementations.find(
      (impl) =>
        impl.language === language && impl.implementation === implementation
    ) ?? provider.implementations.find((impl) => impl.language === language);

  if (!implEntry) {
    return NextResponse.json(
      { error: "Implementation not found" },
      { status: 404 }
    );
  }

  const meta = connector.root.meta;
  const displayName = meta?.name ?? connector.connectorId;
  const description = meta?.description ?? "";
  const tags = meta?.tags ?? [];
  const category = meta?.category;
  const homepage = meta?.homepage;
  const license = meta?.license;

  const reactions = await getIssuePositiveReactionsCountFromMeta(
    provider.meta,
    implEntry.language,
    implEntry.implementation
  );

  // Get URLs
  const registryUrl =
    provider.meta?.registryUrl ??
    meta?.registryUrl ??
    `https://github.com/514-labs/registry/tree/main/connector-registry/${id}/${version}/${creator}`;

  const issueValue = provider.meta?.issues?.[implEntry.language];
  const issueUrl =
    typeof issueValue === "string"
      ? issueValue
      : issueValue && typeof issueValue === "object"
        ? (issueValue[implEntry.implementation] ?? issueValue["default"])
        : `https://github.com/514-labs/registry/issues`;

  const viewSourceUrl = `https://github.com/514-labs/registry/tree/main/connector-registry/${id}/${version}/${creator}/${language}/${implementation}`;

  // Read _meta files (README, CHANGELOG, LICENSE)
  const metaDir = join(implEntry.path, "_meta");
  const metaFiles: Record<string, string> = {};

  if (existsSync(metaDir)) {
    const metaFileNames = ["README.md", "CHANGELOG.md", "LICENSE"];
    for (const fileName of metaFileNames) {
      const filePath = join(metaDir, fileName);
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        try {
          metaFiles[fileName] = readFileSync(filePath, "utf-8");
        } catch (error) {
          console.error(`Error reading ${fileName}:`, error);
        }
      }
    }
  }

  // Read docs files
  const docsDir = join(implEntry.path, "docs");
  const docs: Array<{ slug: string; title: string; content: string }> = [];

  if (existsSync(docsDir)) {
    const docFiles = readdirSync(docsDir)
      .filter(
        (f) =>
          f.toLowerCase().endsWith(".md") || f.toLowerCase().endsWith(".mdx")
      )
      .sort();

    for (const file of docFiles) {
      const filePath = join(docsDir, file);
      if (statSync(filePath).isFile()) {
        try {
          const content = readFileSync(filePath, "utf-8");
          const firstHeadingMatch = content.match(/^#\s+(.+)$/m);
          const title =
            firstHeadingMatch?.[1]?.trim() || file.replace(/\.(md|mdx)$/i, "");
          const slug = file.replace(/\.(md|mdx)$/i, "");
          docs.push({ slug, title, content });
        } catch (error) {
          console.error(`Error reading doc ${file}:`, error);
        }
      }
    }
  }

  // Get schema information
  const { database, endpoints, files, errors } = getSchemaDiagramInputs(
    implEntry.path
  );

  // Build schema docs map
  const schemasDir = join(implEntry.path, "schemas");
  const schemas: Record<string, any> = {};

  if (existsSync(schemasDir)) {
    const readSchemasRecursive = (dir: string, prefix = ""): void => {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          readSchemasRecursive(fullPath, relativePath);
        } else if (entry.name.toLowerCase().endsWith(".md")) {
          try {
            const content = readFileSync(fullPath, "utf-8");
            schemas[relativePath] = content;
          } catch (error) {
            console.error(`Error reading schema ${relativePath}:`, error);
          }
        }
      }
    };

    readSchemasRecursive(schemasDir);
  }

  return NextResponse.json({
    id: connector.connectorId,
    name: displayName,
    description,
    tags,
    category,
    homepage,
    license,
    version,
    creator,
    language,
    implementation: implEntry.implementation,
    path: implEntry.path,
    reactions,
    urls: {
      registry: registryUrl,
      issue: issueUrl,
      source: viewSourceUrl,
      web: `/connectors/${id}/${version}/${creator}/${language}/${implementation}`,
    },
    meta: {
      root: meta,
      provider: provider.meta,
    },
    metaFiles,
    docs,
    schema: {
      database,
      endpoints,
      files,
      errors,
      documentation: schemas,
    },
  });
}
