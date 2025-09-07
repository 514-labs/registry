import { NextRequest, NextResponse } from "next/server";
import { basename, dirname } from "path";
import { listConnectors } from "@workspace/registry/connectors";
import { listPipelines } from "@workspace/registry/pipelines";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  // Get query parameters for filtering
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type"); // "connector" | "pipeline" | null for all
  const language = searchParams.get("language");
  const author = searchParams.get("author");
  const tags = searchParams.get("tags")?.split(",");

  const connectors = type === "pipeline" ? [] : listConnectors();
  const pipelines = type === "connector" ? [] : listPipelines();

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
            `https://github.com/514-labs/factory/tree/main/connector-registry/${c.connectorId}/${version}/${provider.authorId}`;

          const githubUrl =
            impl.implementation === "default"
              ? `${providerBaseUrl}/${impl.language}`
              : `${providerBaseUrl}/${impl.language}/${impl.implementation}`;

          // Apply filters
          if (language && impl.language !== language) return null;
          if (author && itemAuthor !== author && provider.authorId !== author)
            return null;
          if (
            tags &&
            tags.length > 0 &&
            !tags.some((tag) => itemTags.includes(tag))
          )
            return null;

          return {
            type: "connector" as const,
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
            // Additional API-specific fields
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
            `https://github.com/514-labs/factory/tree/main/pipeline-registry/${p.pipelineId}/${version}/${provider.authorId}`;

          const githubUrl =
            impl.implementation === "default"
              ? `${providerBaseUrl}/${impl.language}`
              : `${providerBaseUrl}/${impl.language}/${impl.implementation}`;

          // Apply filters
          if (language && impl.language !== language) return null;
          if (author && itemAuthor !== author && provider.authorId !== author)
            return null;
          if (
            tags &&
            tags.length > 0 &&
            !tags.some((tag) => itemTags.includes(tag))
          )
            return null;

          return {
            type: "pipeline" as const,
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
            // Pipeline-specific fields
            schedule: provider.meta?.schedule,
            source: provider.meta?.source,
            destination: provider.meta?.destination,
            systems: provider.meta?.systems,
            transformations: provider.meta?.transformations,
            lineage: provider.meta?.lineage,
            // Additional API-specific fields
            apiPaths: {
              scaffold: `/api/pipelines/scaffolds/${impl.language}`,
            },
          };
        })
        .filter(Boolean)
    )
  );

  const items = [...connectorItems, ...pipelineItems];

  // Build response with metadata
  const response = {
    total: items.length,
    connectors: connectorItems.length,
    pipelines: pipelineItems.length,
    filters: {
      type: type || "all",
      language: language || null,
      author: author || null,
      tags: tags || null,
    },
    items,
  };

  return NextResponse.json(response);
}
