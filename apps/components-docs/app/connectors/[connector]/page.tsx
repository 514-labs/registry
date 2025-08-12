import Image from "next/image";
import { Badge } from "@ui/components/badge";
import { Card } from "@ui/components/card";
import { cn } from "@/lib/utils";
import { listConnectorIds, readConnector } from "@workspace/registry";
import { PagefindMeta } from "@/components/pagefind-meta";

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

  return (
    <div className="container mx-auto py-16 ">
      <PagefindMeta type="connector" />
      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-4">
          <div className="flex flex-col gap-4">
            <Card className="h-full overflow-hidden p-0">
              <div className="relative p-8">
                <Image
                  src={`/connector-logos/${displayName.replace(/\s+/g, "")}.png`}
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
            <h1>Get Started</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
