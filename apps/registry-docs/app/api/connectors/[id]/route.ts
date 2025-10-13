import { NextResponse } from "next/server";
import { readConnector } from "@workspace/registry/connectors";
import { getIssuePositiveReactionsCountFromMeta } from "@workspace/registry";

export const dynamic = "force-static";
export const dynamicParams = true;

type Params = {
  id: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;

  const connector = readConnector(id);
  if (!connector) {
    return NextResponse.json(
      { error: "Connector not found" },
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
  const registryUrl = meta?.registryUrl;

  // Build versions and providers list
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

      // Aggregate implementations
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
            apiUrl: `/api/connectors/${id}/${version}/${provider.authorId}/${impl.language}/${impl.implementation}`,
            webUrl: `/connectors/${id}/${version}/${provider.authorId}/${impl.language}/${impl.implementation}`,
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

  return NextResponse.json({
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
  });
}
