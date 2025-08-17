/// <reference types="node" />
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  mkdirSync,
} from "fs";
import { join, resolve, dirname as pathDirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

type ProviderConnectorMeta = {
  $schema?: string;
  name: string;
  author: string;
  version?: string;
  languages?: string[];
  tags?: string[];
  category?: string;
  description?: string;
  homepage?: string;
  registryUrl?: string;
  license?: string;
  source?: Record<string, unknown>;
  capabilities?: Record<string, unknown>;
  maintainers?: Array<Record<string, unknown>>;
  // Map of language to either a single URL string (back-compat)
  // or to a map of implementation name -> URL
  issues?: Record<string, string | Record<string, string>>;
};

type VersionMeta = { version?: string };

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function listDirectories(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !name.startsWith(".") && !name.startsWith("_"));
}

function detectIndentFromJson(jsonContent: string): string {
  // If tabs appear on any indented line, use tabs
  const lines = jsonContent.split(/\r?\n/);
  if (lines.some((l) => /^\t+"/.test(l))) return "\t";
  // Find minimal leading spaces before a key
  let minSpaces: number | undefined;
  for (const line of lines) {
    const m = line.match(/^( +)"/);
    if (m) {
      const count = m[1].length;
      if (!minSpaces || (count > 0 && count < minSpaces)) minSpaces = count;
    }
  }
  if (typeof minSpaces === "number" && minSpaces > 0)
    return " ".repeat(minSpaces);
  return "  ";
}

function getTrailingNewline(content: string): string {
  return content.endsWith("\n") ? "\n" : "";
}

// env owner/repo are fixed to 514-labs/connector-factory per product requirement

async function searchExistingIssue(
  token: string,
  owner: string,
  repo: string,
  title: string
): Promise<string | undefined> {
  const query = `repo:${owner}/${repo} type:issue in:title "${title.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  const url = new URL("https://api.github.com/search/issues");
  url.searchParams.set("q", query);
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as {
    items?: Array<{ html_url: string; title: string }>;
  };
  const match = data.items?.find((i) => i.title === title);
  return match?.html_url;
}

async function createIssue(
  token: string,
  owner: string,
  repo: string,
  title: string,
  body: string
): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ title, body }),
    }
  );
  if (!res.ok) {
    const txt = await res.text();
    console.error(
      `Failed to create issue: ${res.status} ${res.statusText} - ${txt}`
    );
    return undefined;
  }
  const data = (await res.json()) as { html_url?: string };
  return data.html_url;
}

function ensureIssuesMap(
  meta: ProviderConnectorMeta
): Record<string, string | Record<string, string>> {
  if (!meta.issues) meta.issues = {};
  return meta.issues as Record<string, string | Record<string, string>>;
}

function getImplementationDirs(languagePath: string): string[] {
  const entries = listDirectories(languagePath);
  // If there are no subdirectories, treat the language root as a single "default" implementation
  return entries.length === 0 ? ["default"] : entries;
}

async function main(): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = pathDirname(__filename);
  const registryDir = resolve(__dirname, "..");
  const monorepoRoot = resolve(registryDir, "..", "..");
  const registryRoot = join(monorepoRoot, "connector-registry");

  dotenv.config({ path: join(monorepoRoot, ".env") });
  const token = (process.env.GITHUB_PAT || "").trim();
  if (!token) {
    console.error(
      [
        "Missing GITHUB_PAT in repository root .env.",
        "Create a token (classic) with repo scope here:",
        "https://github.com/settings/tokens/new?scopes=repo",
        "Then add a line like `GITHUB_PAT=ghp_xxx` to the repository root .env and rerun.",
      ].join("\n")
    );
    process.exit(1);
  }

  const ownerRepo = { owner: "514-labs", repo: "connector-factory" };

  const connectors = listDirectories(registryRoot);
  const summary: Array<{
    path: string;
    action: "created" | "linked" | "skipped";
    url?: string;
  }> = [];

  for (const connectorId of connectors) {
    const connectorPath = join(registryRoot, connectorId);
    const versionDirs = listDirectories(connectorPath);

    // If no versions present, skip (no provider/impls to link)
    if (versionDirs.length === 0) continue;

    for (const versionId of versionDirs) {
      const versionPath = join(connectorPath, versionId);
      const versionMetaPath = join(versionPath, "_meta", "version.json");
      let versionLabel = versionId;
      try {
        if (existsSync(versionMetaPath)) {
          const vRaw = readFileSync(versionMetaPath, "utf-8");
          const vParsed = JSON.parse(vRaw) as VersionMeta;
          if (vParsed.version) versionLabel = vParsed.version;
        }
      } catch {
        // ignore meta parse errors and fall back to directory name
      }

      const providerDirs = listDirectories(versionPath);
      for (const providerId of providerDirs) {
        const providerPath = join(versionPath, providerId);
        const providerMetaPath = join(providerPath, "_meta", "connector.json");
        let providerMetaRaw = "";
        let trailingNewline = "\n";
        let indent = "  ";
        let providerMeta: ProviderConnectorMeta = {
          name: connectorId,
          author: providerId,
        };

        if (existsSync(providerMetaPath)) {
          providerMetaRaw = readFileSync(providerMetaPath, "utf-8");
          trailingNewline = getTrailingNewline(providerMetaRaw);
          indent = detectIndentFromJson(providerMetaRaw);
          try {
            providerMeta = JSON.parse(providerMetaRaw) as ProviderConnectorMeta;
          } catch {
            console.error(`Skipping due to invalid JSON: ${providerMetaPath}`);
            continue;
          }
        } else {
          // If no provider meta exists, providerMeta remains initialized
          indent = "  ";
          trailingNewline = "\n";
        }

        const languages = listDirectories(providerPath);
        for (const language of languages) {
          const languagePath = join(providerPath, language);
          const implementations = getImplementationDirs(languagePath);

          const issuesMap = ensureIssuesMap(providerMeta);
          const existing = issuesMap[language];
          // Normalize to per-implementation map
          let perImpl: Record<string, string> = {};
          if (typeof existing === "string" && existing.trim().length > 0) {
            perImpl = { default: existing };
          } else if (existing && typeof existing === "object") {
            perImpl = { ...existing } as Record<string, string>;
          }

          for (const impl of implementations) {
            const implPath =
              impl === "default" ? languagePath : join(languagePath, impl);
            const already = perImpl[impl];
            if (already && already.trim().length > 0) {
              summary.push({
                path: join(connectorId, versionId, providerId, language, impl),
                action: "skipped",
                url: already,
              });
              continue;
            }

            const title = `Connector: ${connectorId}@${versionLabel} - ${providerId}/${language}/${impl}`;
            const body = [
              `Tracking implementation for ${connectorId}@${versionLabel}`,
              "",
              `Author: ${providerId}`,
              `Language: ${language}`,
              `Implementation: ${impl}`,
              "",
              "Paths:",
              `- Provider: connector-registry/${connectorId}/${versionId}/${providerId}`,
              `- Implementation: connector-registry/${connectorId}/${versionId}/${providerId}/${language}${impl === "default" ? "" : "/" + impl}`,
              `- Filesystem: ${implPath}`,
            ].join("\n");

            let issueUrl = await searchExistingIssue(
              token,
              ownerRepo.owner,
              ownerRepo.repo,
              title
            );
            let action: "created" | "linked" = "linked";
            if (!issueUrl) {
              issueUrl = await createIssue(
                token,
                ownerRepo.owner,
                ownerRepo.repo,
                title,
                body
              );
              action = "created";
            }
            if (!issueUrl) {
              console.error(`Failed to obtain issue URL for ${title}`);
              continue;
            }

            // Assign and persist
            perImpl[impl] = issueUrl;
            issuesMap[language] = perImpl;

            const serialized =
              JSON.stringify(providerMeta, null, indent) + trailingNewline;
            const metaDir = pathDirname(providerMetaPath);
            try {
              mkdirSync(metaDir, { recursive: true });
            } catch {}
            writeFileSync(providerMetaPath, serialized, "utf-8");

            summary.push({
              path: join(connectorId, versionId, providerId, language, impl),
              action,
              url: issueUrl,
            });
          }
        }
      }
    }
  }

  if (summary.length === 0) {
    console.log("No implementations found requiring issues.");
    return;
  }

  for (const row of summary) {
    console.log(
      `${row.action.toUpperCase()}: ${row.path}${row.url ? ` -> ${row.url}` : ""}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
