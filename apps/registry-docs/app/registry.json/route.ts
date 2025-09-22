import { NextResponse } from "next/server";
import { basename, dirname, join } from "path";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { getConnectorsRegistryPath } from "@workspace/registry/connectors";
import { getPipelinesRegistryPath } from "@workspace/registry/pipelines";

export const dynamic = "force-static";

// Lightweight metadata-only reading functions
function readJsonSafe(filePath: string): any {
  try {
    if (!existsSync(filePath)) return undefined;
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function listConnectorIdsOnly(): string[] {
  const registryDir = getConnectorsRegistryPath();
  const entries = readdirSync(registryDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(".") && !name.startsWith("_"))
    .filter((name) => /^[a-zA-Z0-9_-]+$/.test(name));
}

function listPipelineIdsOnly(): string[] {
  const registryDir = getPipelinesRegistryPath();
  const entries = readdirSync(registryDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(".") && !name.startsWith("_"))
    .filter((name) => /^[a-zA-Z0-9_-]+$/.test(name));
}

export async function GET() {
  const connectorIds = listConnectorIdsOnly();
  const pipelineIds = listPipelineIdsOnly();
  const connectorsRegistryDir = getConnectorsRegistryPath();
  const pipelinesRegistryDir = getPipelinesRegistryPath();

  const connectorItems: any[] = [];

  // Process connectors - only read _meta files
  for (const connectorId of connectorIds) {
    const connectorPath = join(connectorsRegistryDir, connectorId);
    const rootMeta = readJsonSafe(join(connectorPath, "_meta", "connector.json"));

    const versionDirs = readdirSync(connectorPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== "_meta")
      .map((entry) => entry.name);

    for (const versionId of versionDirs) {
      const versionPath = join(connectorPath, versionId);
      const providerDirs = readdirSync(versionPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
        .map((entry) => entry.name);

      for (const authorId of providerDirs) {
        const providerPath = join(versionPath, authorId);
        const providerMeta = readJsonSafe(join(providerPath, "_meta", "connector.json"));

        // Get languages from directory structure only (don't read implementation files)
        const langDirs = existsSync(providerPath) ?
          readdirSync(providerPath, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
            .map((entry) => entry.name) : [];

        for (const language of langDirs) {
          const langPath = join(providerPath, language);
          const implementations = existsSync(langPath) ?
            readdirSync(langPath, { withFileTypes: true })
              .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
              .map((entry) => entry.name) : ["default"];

          for (const implementation of implementations.length > 0 ? implementations : ["default"]) {
            const category = providerMeta?.category ?? rootMeta?.category;
            const tags = providerMeta?.tags ?? rootMeta?.tags ?? [];
            const description = providerMeta?.description ?? rootMeta?.description ?? "";
            const homepage = providerMeta?.homepage ?? rootMeta?.homepage;

            const providerBaseUrl = providerMeta?.registryUrl ?? rootMeta?.registryUrl ??
              `https://github.com/514-labs/factory/tree/main/connector-registry/${connectorId}/${versionId}/${authorId}`;

            const githubUrl = implementation === "default"
              ? `${providerBaseUrl}/${language}`
              : `${providerBaseUrl}/${language}/${implementation}`;

            connectorItems.push({
              type: "connector" as const,
              id: connectorId,
              name: rootMeta?.name ?? providerMeta?.name ?? connectorId,
              version: versionId,
              author: providerMeta?.author ?? authorId,
              language,
              implementation,
              category,
              tags,
              description,
              homepage,
              license: providerMeta?.license,
              languages: providerMeta?.languages,
              capabilities: providerMeta?.capabilities,
              maintainers: providerMeta?.maintainers ?? [],
              authorType: providerMeta?.authorType,
              issues: providerMeta?.issues,
              githubUrl,
              providerGithubUrl: providerBaseUrl,
            });
          }
        }
      }
    }
  }

  // Process pipelines - only read _meta files
  const pipelineItems: any[] = [];
  for (const pipelineId of pipelineIds) {
    const pipelinePath = join(pipelinesRegistryDir, pipelineId);
    const rootMeta = readJsonSafe(join(pipelinePath, "_meta", "pipeline.json"));

    const versionDirs = readdirSync(pipelinePath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== "_meta")
      .map((entry) => entry.name);

    for (const versionId of versionDirs) {
      const versionPath = join(pipelinePath, versionId);
      const providerDirs = readdirSync(versionPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
        .map((entry) => entry.name);

      for (const authorId of providerDirs) {
        const providerPath = join(versionPath, authorId);
        const providerMeta = readJsonSafe(join(providerPath, "_meta", "pipeline.json"));

        const langDirs = existsSync(providerPath) ?
          readdirSync(providerPath, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
            .map((entry) => entry.name) : [];

        for (const language of langDirs) {
          const langPath = join(providerPath, language);
          const implementations = existsSync(langPath) ?
            readdirSync(langPath, { withFileTypes: true })
              .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
              .map((entry) => entry.name) : ["default"];

          for (const implementation of implementations.length > 0 ? implementations : ["default"]) {
            const tags = providerMeta?.tags ?? rootMeta?.tags ?? [];
            const description = providerMeta?.description ?? rootMeta?.description ?? "";
            const homepage = rootMeta?.homepage;

            const providerBaseUrl = rootMeta?.registryUrl ??
              `https://github.com/514-labs/factory/tree/main/pipeline-registry/${pipelineId}/${versionId}/${authorId}`;

            const githubUrl = implementation === "default"
              ? `${providerBaseUrl}/${language}`
              : `${providerBaseUrl}/${language}/${implementation}`;

            pipelineItems.push({
              type: "pipeline" as const,
              id: pipelineId,
              name: rootMeta?.name ?? providerMeta?.name ?? pipelineId,
              version: versionId,
              author: providerMeta?.author ?? authorId,
              language,
              implementation,
              tags,
              description,
              homepage,
              maintainers: providerMeta?.maintainers ?? [],
              authorType: providerMeta?.authorType,
              githubUrl,
              providerGithubUrl: providerBaseUrl,
            });
          }
        }
      }
    }
  }

  const items = [...connectorItems, ...pipelineItems];
  return NextResponse.json(items);
}
