import { NextResponse } from "next/server";
import { basename, dirname } from "path";
import { listConnectors } from "@workspace/registry/connectors";

export const dynamic = "force-static";

export async function GET() {
  const connectors = listConnectors();

  const items = connectors.flatMap((c) =>
    c.providers.flatMap((provider) =>
      provider.implementations.map((impl) => {
        const version = basename(dirname(provider.path));
        const category = provider.meta?.category ?? c.root.meta?.category;
        const tags = provider.meta?.tags ?? c.root.meta?.tags ?? [];
        const description =
          provider.meta?.description ?? c.root.meta?.description ?? "";
        const homepage = provider.meta?.homepage ?? c.root.meta?.homepage;
        const license = provider.meta?.license;
        const languages = provider.meta?.languages;
        const capabilities = provider.meta?.capabilities;
        const maintainers = provider.meta?.maintainers ?? [];
        const authorType = provider.meta?.authorType;
        const issues = provider.meta?.issues;

        const providerBaseUrl =
          provider.meta?.registryUrl ??
          c.root.meta?.registryUrl ??
          `https://github.com/514-labs/factory/tree/main/connector-registry/${c.connectorId}/${version}/${provider.authorId}`;

        const githubUrl =
          impl.implementation === "default"
            ? `${providerBaseUrl}/${impl.language}`
            : `${providerBaseUrl}/${impl.language}/${impl.implementation}`;

        return {
          type: "connector",
          id: c.connectorId,
          name: c.root.meta?.name ?? provider.meta?.name ?? c.connectorId,
          version,
          author: provider.meta?.author ?? provider.authorId,
          language: impl.language,
          implementation: impl.implementation,
          category,
          tags,
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
        };
      })
    )
  );

  return NextResponse.json(items);
}
