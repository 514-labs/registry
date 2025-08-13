import Image from "next/image";
import { Badge } from "@ui/components/badge";
import { Card } from "@ui/components/card";
import { cn } from "@/lib/utils";
import {
  listConnectorIds,
  readConnector,
  getIssuePositiveReactionsCountFromMeta,
} from "@workspace/registry";
import { PagefindMeta } from "@/components/pagefind-meta";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = {
  connector: string;
  version: string;
  creator: string;
  language: string;
  implementation: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const connector of listConnectorIds()) {
    const conn = readConnector(connector);
    if (!conn) continue;
    for (const provider of conn.providers) {
      const version = provider.path.split("/").slice(-2)[0];
      for (const impl of provider.implementations) {
        params.push({
          connector,
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

export default async function ConnectorImplementationPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { connector, version, creator, language, implementation } =
    await params;
  const sp = await searchParams;
  const page = (Array.isArray(sp.page) ? sp.page[0] : sp.page) ?? "readme";

  const conn = readConnector(connector);
  if (!conn) return null;

  const provider = conn.providers.find((p) => {
    const pVersion = p.path.split("/").slice(-2)[0];
    return p.authorId === creator && pVersion === version;
  });
  if (!provider) return null;

  const implEntry =
    provider.implementations.find(
      (impl) =>
        impl.language === language && impl.implementation === implementation
    ) ?? provider.implementations.find((impl) => impl.language === language);
  if (!implEntry) return null;

  const meta = conn.root.meta;
  const displayName = meta?.title ?? meta?.name ?? conn.connectorId;
  const description = meta?.description ?? "";
  const tags = meta?.tags ?? [];

  const reactions = await getIssuePositiveReactionsCountFromMeta(
    provider.meta,
    implEntry.language,
    implEntry.implementation
  );

  return (
    <div className="container mx-auto py-16 ">
      <PagefindMeta type="connector" />
      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-4">
          <div className="flex flex-col gap-4">
            <Card className="h-full overflow-hidden p-0">
              <div className="relative p-8">
                <Image
                  src={`/connector-logos/${conn.connectorId}.png`}
                  alt={`${displayName} logo`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-sm object-contain mx-auto relative z-10"
                />
                <div
                  className={cn(
                    "bg-gradient-to-b h-full w-full  blur-sm absolute top-0 left-0",
                    "from-60% from-card",
                    "to-neutral-500/20"
                  )}
                />
              </div>
            </Card>
            <h1 className="text-2xl ">{displayName}</h1>
            <div className="text-sm text-muted-foreground">
              👍❤️ {reactions}
            </div>
            <p className="text-muted-foreground">{description}</p>
            <div className="flex flex-row gap-2">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-8">
          <div className="prose dark:prose-invert">
            {page === "readme" ? <h1>Get Started</h1> : <h1>{page}</h1>}
            <div className="text-sm text-muted-foreground mt-2">
              <div>Version: {version}</div>
              <div>Creator: {creator}</div>
              <div>Language: {language}</div>
              <div>Implementation: {implEntry.implementation}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
