import {
  listConnectorIds,
  readConnector,
  getIssueThumbsUpCountFromMeta,
} from "@workspace/registry";
import { PagefindMeta } from "@/components/pagefind-meta";
import ConnectorDetailsSidebar from "@/components/connector-details-sidebar";
import ConnectorDetailsInstallation from "@/components/connector-details-installation";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ connector: string }[]> {
  return listConnectorIds().map((id: string) => ({ connector: id }));
}

export default async function ConnectorPage({
  params,
}: {
  params: Promise<{ connector: string }>;
}) {
  const { connector } = await params;
  const conn = readConnector(connector);
  if (!conn) return null;

  const meta = conn.root.meta;
  const displayName = meta?.title ?? meta?.name ?? conn.connectorId;
  const description = meta?.description ?? "";
  const tags = meta?.tags ?? [];

  const thumbsPromises: Array<Promise<number>> = conn.providers.flatMap(
    (provider) => {
      const issues = provider.meta?.issues ?? {};
      return Object.keys(issues).map((language) =>
        getIssueThumbsUpCountFromMeta(provider.meta, language)
      );
    }
  );
  const thumbsArray = await Promise.all(thumbsPromises);
  const totalThumbs = thumbsArray.reduce(
    (sum, n) => sum + (Number.isFinite(n) ? n : 0),
    0
  );

  return (
    <div className="container mx-auto py-16 ">
      <PagefindMeta type="connector" />
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-3">
          <ConnectorDetailsSidebar
            connectorId={conn.connectorId}
            displayName={displayName}
            description={description}
            thumbsUpCount={totalThumbs}
            tagList={tags}
          />
        </div>
        <div className="col-span-8">
          {/* For now, pick the first provider/version */}
          <ConnectorDetailsInstallation
            connectorId={conn.connectorId}
            versionId={conn.providers[0]?.path.split("/").slice(-2, -1)[0] ?? ""}
            authorId={conn.providers[0]?.authorId ?? ""}
            language={(conn.providers[0]?.implementations?.[0]?.language as "typescript" | "python") ?? "typescript"}
          />
        </div>
      </div>
    </div>
  );
}
