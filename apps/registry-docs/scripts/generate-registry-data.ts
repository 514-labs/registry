import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync, statSync, copyFileSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { dirname as pathDirname } from "path";
import { listConnectors, getConnectorsRegistryPath } from "@workspace/registry/connectors";
import { listPipelines, getPipelinesRegistryPath } from "@workspace/registry/pipelines";
import { getIssuePositiveReactionsCountFromMeta } from "@workspace/registry";
import { getSchemaDiagramInputs } from "../src/schema/processing";
import { buildDiscoverConnectors } from "../lib/connector-discover";
import { buildDiscoverPipelines } from "../lib/pipeline-discover";

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

console.log("Generating registry data...");

// Utility to ensure directory exists
function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

// Utility to write JSON file
function writeJson(filePath: string, data: any): void {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Get all connectors and pipelines
const connectors = listConnectors();
const pipelines = listPipelines();

console.log(`Found ${connectors.length} connectors and ${pipelines.length} pipelines`);

// ===== 1. Generate registry-contents.json (for /api/registry/contents) =====

const connectorItems = connectors.flatMap((c) =>
  c.providers.flatMap((provider) =>
    provider.implementations
      .map((impl) => {
        const version = basename(dirname(provider.path));
        const category = provider.meta?.category ?? c.root.meta?.category;
        const itemTags = provider.meta?.tags ?? c.root.meta?.tags ?? [];
        const description =
          provider.meta?.description ?? c.root.meta?.description ?? "";
        const homepage = provider.meta?.homepage ?? c.root.meta?.homepage;
        const license = provider.meta?.license;
        const languages = provider.meta?.languages;
        const capabilities = provider.meta?.capabilities;
        const maintainers = provider.meta?.maintainers ?? [];
        const authorType = provider.meta?.authorType;
        const issues = provider.meta?.issues;
        const itemAuthor = provider.meta?.author ?? provider.authorId;

        const providerBaseUrl =
          provider.meta?.registryUrl ??
          c.root.meta?.registryUrl ??
          `https://github.com/514-labs/registry/tree/main/connector-registry/${c.connectorId}/${version}/${provider.authorId}`;

        const githubUrl =
          impl.implementation === "default"
            ? `${providerBaseUrl}/${impl.language}`
            : `${providerBaseUrl}/${impl.language}/${impl.implementation}`;

        return {
          type: "connector",
          id: c.connectorId,
          name: c.root.meta?.name ?? provider.meta?.name ?? c.connectorId,
          version,
          author: itemAuthor,
          authorId: provider.authorId,
          language: impl.language,
          implementation: impl.implementation,
          category,
          tags: itemTags,
          description,
          homepage,
          license,
          languages,
          capabilities,
          maintainers,
          authorType,
          issues,
          githubUrl,
          providerGithubUrl: providerBaseUrl,
          apiPaths: {
            scaffold: `/api/connectors/scaffolds/${impl.language}`,
          },
        };
      })
      .filter(Boolean)
  )
);

const pipelineItems = pipelines.flatMap((p) =>
  p.providers.flatMap((provider) =>
    provider.implementations
      .map((impl) => {
        const version = basename(dirname(provider.path));
        const itemTags = provider.meta?.tags ?? p.root.meta?.tags ?? [];
        const description =
          provider.meta?.description ?? p.root.meta?.description ?? "";
        const homepage = p.root.meta?.homepage;
        const maintainers = provider.meta?.maintainers ?? [];
        const authorType = provider.meta?.authorType;
        const itemAuthor = provider.meta?.author ?? provider.authorId;

        const providerBaseUrl =
          p.root.meta?.registryUrl ??
          `https://github.com/514-labs/registry/tree/main/pipeline-registry/${p.pipelineId}/${version}/${provider.authorId}`;

        const githubUrl =
          impl.implementation === "default"
            ? `${providerBaseUrl}/${impl.language}`
            : `${providerBaseUrl}/${impl.language}/${impl.implementation}`;

        return {
          type: "pipeline",
          id: p.pipelineId,
          name: p.root.meta?.name ?? provider.meta?.name ?? p.pipelineId,
          version,
          author: itemAuthor,
          authorId: provider.authorId,
          language: impl.language,
          implementation: impl.implementation,
          tags: itemTags,
          description,
          homepage,
          maintainers,
          authorType,
          githubUrl,
          providerGithubUrl: providerBaseUrl,
          schedule: provider.meta?.schedule,
          source: provider.meta?.source,
          destination: provider.meta?.destination,
          systems: provider.meta?.systems,
          transformations: provider.meta?.transformations,
          lineage: provider.meta?.lineage,
          apiPaths: {
            scaffold: `/api/pipelines/scaffolds/${impl.language}`,
          },
        };
      })
      .filter(Boolean)
  )
);

const allItems = [...connectorItems, ...pipelineItems];

// Write registry-contents.json
const registryContents = {
  total: allItems.length,
  connectors: connectorItems.length,
  pipelines: pipelineItems.length,
  items: allItems,
};

const registryContentsPath = join(__dirname, "..", "public", "registry-contents.json");
writeJson(registryContentsPath, registryContents);
console.log(`✓ Generated registry-contents.json: ${registryContents.total} total items`);

// ===== 2. Generate registry.json (simplified list for /registry.json) =====

const registryJsonPath = join(__dirname, "..", "public", "registry.json");
writeJson(registryJsonPath, allItems);
console.log(`✓ Generated registry.json: ${allItems.length} items`);

// ===== 3. Generate individual connector overview JSON files =====

async function generateAllFiles() {
let connectorOverviewCount = 0;
for (const connector of connectors) {
  const meta = connector.root.meta;
  const displayName = meta?.name ?? connector.connectorId;
  const description = meta?.description ?? "";
  const tags = meta?.tags ?? [];
  const category = meta?.category;
  const homepage = meta?.homepage;
  const license = meta?.license;
  const registryUrl = meta?.registryUrl;

  // Build versions list
  const versions = Array.from(
    new Set(
      connector.providers.map((p) => {
        const parts = p.path.split("/");
        return parts[parts.length - 2];
      })
    )
  );

  // Build providers info with implementations
  const providers = await Promise.all(
    connector.providers.map(async (provider) => {
      const version = provider.path.split("/").slice(-2)[0];

      const implementations = await Promise.all(
        provider.implementations.map(async (impl) => {
          const reactions = await getIssuePositiveReactionsCountFromMeta(
            provider.meta,
            impl.language,
            impl.implementation
          );

          const issueValue = provider.meta?.issues?.[impl.language];
          const issueUrl =
            typeof issueValue === "string"
              ? issueValue
              : issueValue && typeof issueValue === "object"
                ? (issueValue[impl.implementation] ?? issueValue["default"])
                : undefined;

          return {
            language: impl.language,
            implementation: impl.implementation,
            path: impl.path,
            reactions,
            issueUrl,
            apiUrl: `/api/connectors/${connector.connectorId}/${version}/${provider.authorId}/${impl.language}/${impl.implementation}`,
            webUrl: `/connectors/${connector.connectorId}/${version}/${provider.authorId}/${impl.language}/${impl.implementation}`,
          };
        })
      );

      const override = provider.meta?.avatarUrlOverride?.trim();
      const primaryName = provider.authorId;
      const secondaryName = provider.meta?.author?.trim();
      const avatarUrl =
        override ||
        (primaryName ? `https://github.com/${primaryName}.png` : undefined) ||
        (secondaryName ? `https://github.com/${secondaryName}.png` : undefined);

      return {
        authorId: provider.authorId,
        version,
        path: provider.path,
        meta: provider.meta,
        avatarUrl,
        implementations,
      };
    })
  );

  const connectorOverview = {
    id: connector.connectorId,
    name: displayName,
    description,
    tags,
    category,
    homepage,
    license,
    registryUrl,
    versions,
    providers,
  };

  const connectorOverviewPath = join(
    __dirname,
    "..",
    "public",
    "api",
    "connectors",
    `${connector.connectorId}.json`
  );
  writeJson(connectorOverviewPath, connectorOverview);
  connectorOverviewCount++;
}

console.log(`✓ Generated ${connectorOverviewCount} connector overview files`);

// ===== 4. Generate detailed implementation JSON files =====

let implementationCount = 0;
for (const connector of connectors) {
  for (const provider of connector.providers) {
    const version = provider.path.split("/").slice(-2)[0];

    for (const implEntry of provider.implementations) {
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

      const registryUrl =
        provider.meta?.registryUrl ??
        meta?.registryUrl ??
        `https://github.com/514-labs/registry/tree/main/connector-registry/${connector.connectorId}/${version}/${provider.authorId}`;

      const issueValue = provider.meta?.issues?.[implEntry.language];
      const issueUrl =
        typeof issueValue === "string"
          ? issueValue
          : issueValue && typeof issueValue === "object"
            ? (issueValue[implEntry.implementation] ?? issueValue["default"])
            : `https://github.com/514-labs/registry/issues`;

      const viewSourceUrl = `https://github.com/514-labs/registry/tree/main/connector-registry/${connector.connectorId}/${version}/${provider.authorId}/${implEntry.language}/${implEntry.implementation}`;

      // Read _meta files
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
      const schemas: Record<string, string> = {};

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

      const implDetail = {
        id: connector.connectorId,
        name: displayName,
        description,
        tags,
        category,
        homepage,
        license,
        version,
        creator: provider.authorId,
        language: implEntry.language,
        implementation: implEntry.implementation,
        path: implEntry.path,
        reactions,
        urls: {
          registry: registryUrl,
          issue: issueUrl,
          source: viewSourceUrl,
          web: `/connectors/${connector.connectorId}/${version}/${provider.authorId}/${implEntry.language}/${implEntry.implementation}`,
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
      };

      const implDetailPath = join(
        __dirname,
        "..",
        "public",
        "api",
        "connectors",
        connector.connectorId,
        version,
        provider.authorId,
        implEntry.language,
        `${implEntry.implementation}.json`
      );

      writeJson(implDetailPath, implDetail);
      implementationCount++;
    }
  }
}

console.log(`✓ Generated ${implementationCount} implementation detail files`);

// ===== 5. Copy scaffold files to public directory =====

const connectorsScaffoldDir = join(getConnectorsRegistryPath(), "_scaffold");
const pipelinesScaffoldDir = join(getPipelinesRegistryPath(), "_scaffold");
const publicScaffoldsDir = join(__dirname, "..", "public", "scaffolds");

ensureDir(join(publicScaffoldsDir, "connectors"));
ensureDir(join(publicScaffoldsDir, "pipelines"));

let scaffoldCount = 0;

// Copy connector scaffolds
if (existsSync(connectorsScaffoldDir)) {
  const scaffoldFiles = readdirSync(connectorsScaffoldDir).filter(f => f.endsWith('.json'));
  for (const file of scaffoldFiles) {
    const sourcePath = join(connectorsScaffoldDir, file);
    const destPath = join(publicScaffoldsDir, "connectors", file);
    copyFileSync(sourcePath, destPath);
    scaffoldCount++;
  }
}

// Copy pipeline scaffolds
if (existsSync(pipelinesScaffoldDir)) {
  const scaffoldFiles = readdirSync(pipelinesScaffoldDir).filter(f => f.endsWith('.json'));
  for (const file of scaffoldFiles) {
    const sourcePath = join(pipelinesScaffoldDir, file);
    const destPath = join(publicScaffoldsDir, "pipelines", file);
    copyFileSync(sourcePath, destPath);
    scaffoldCount++;
  }
}

console.log(`✓ Copied ${scaffoldCount} scaffold files`);

// ===== 6. Generate discover API responses =====

const discoverConnectors = await buildDiscoverConnectors();
const discoverConnectorsPath = join(__dirname, "..", "public", "api", "discover", "connectors.json");
writeJson(discoverConnectorsPath, discoverConnectors);
console.log(`✓ Generated discover connectors response (${discoverConnectors.length} items)`);

const discoverPipelines = await buildDiscoverPipelines();
const discoverPipelinesPath = join(__dirname, "..", "public", "api", "discover", "pipelines.json");
writeJson(discoverPipelinesPath, discoverPipelines);
console.log(`✓ Generated discover pipelines response (${discoverPipelines.length} items)`);

// ===== Summary =====
console.log("\n✅ Registry data generation complete!");
console.log(`   - registry-contents.json: ${registryContents.total} items`);
console.log(`   - registry.json: ${allItems.length} items`);
console.log(`   - ${connectorOverviewCount} connector overview files`);
console.log(`   - ${implementationCount} implementation detail files`);
console.log(`   - ${scaffoldCount} scaffold files`);
console.log(`   - ${discoverConnectors.length} discover connectors`);
console.log(`   - ${discoverPipelines.length} discover pipelines`);
}

// Run the async function
generateAllFiles().catch((error) => {
  console.error("Error generating registry data:", error);
  process.exit(1);
});
