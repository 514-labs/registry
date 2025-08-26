import { NextResponse } from "next/server";
import { readdirSync, Dirent, existsSync, readFileSync } from "fs";
import { join } from "path";
import { getConnectorsRegistryPath } from "@workspace/registry/connectors";

export const dynamic = "force-static";

type LanguageLevelMeta = {
  identifier?: string;
  name: string;
  author: string;
  version: string;
  language: string;
  implementations: string[];
};

type RegistryItem = {
  identifier?: string;
  name: string;
  author: string;
  version: string;
  language: string;
  implementation: string;
};

function readJsonSafe<T = unknown>(filePath: string): T | undefined {
  try {
    if (!existsSync(filePath)) return undefined;
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error parsing JSON file: ${filePath}`, error);
    return undefined;
  }
}

function isVisibleDir(entry: Dirent): boolean {
  return (
    entry.isDirectory() &&
    !entry.name.startsWith("_") &&
    !entry.name.startsWith(".")
  );
}

export async function GET() {
  const registryDir = getConnectorsRegistryPath();
  const result: RegistryItem[] = [];

  // Walk: connector-registry/<name>/<version>/<author>/<language>/<implementation>
  const connectorDirs = readdirSync(registryDir, {
    withFileTypes: true,
  }).filter(isVisibleDir);
  for (const connectorEntry of connectorDirs) {
    const connectorName = connectorEntry.name;
    const connectorPath = join(registryDir, connectorName);

    const versionEntries = readdirSync(connectorPath, {
      withFileTypes: true,
    }).filter(isVisibleDir);
    for (const versionEntry of versionEntries) {
      const version = versionEntry.name;
      const versionPath = join(connectorPath, version);

      const authorEntries = readdirSync(versionPath, {
        withFileTypes: true,
      }).filter(isVisibleDir);
      for (const authorEntry of authorEntries) {
        const author = authorEntry.name;
        const authorPath = join(versionPath, author);

        const languageEntries = readdirSync(authorPath, {
          withFileTypes: true,
        }).filter(isVisibleDir);
        for (const languageEntry of languageEntries) {
          const language = languageEntry.name;
          const languagePath = join(authorPath, language);
          const metaPath = join(languagePath, "_meta", "connector.json");
          const languageMeta = readJsonSafe<LanguageLevelMeta>(metaPath);

          if (!languageMeta) continue;

          for (const implementation of languageMeta.implementations) {
            result.push({
              identifier: languageMeta.identifier,
              name: languageMeta.name,
              author: languageMeta.author,
              version: languageMeta.version,
              language: languageMeta.language,
              implementation,
            });
          }
        }
      }
    }
  }

  return NextResponse.json(result);
}
