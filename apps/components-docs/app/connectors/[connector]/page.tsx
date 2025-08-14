import { listConnectorIds, readConnector } from "@workspace/registry";
import { redirect } from "next/navigation";
import { basename, dirname } from "path";

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
  try {
    const { connector } = await params;
    const conn = readConnector(connector);
    if (!conn) throw new Error(`Connector not found: ${connector}`);

    const firstProvider = conn.providers[0];
    if (!firstProvider) throw new Error(`No providers for ${connector}`);
    const version = basename(dirname(firstProvider.path));
    const language = firstProvider.implementations[0]?.language ?? "typescript";
    const creator = firstProvider.authorId;
    const implementation =
      firstProvider.implementations[0]?.implementation ?? "default";

    redirect(
      `/connectors/${connector}/${version}/${creator}/${language}/${implementation}?page=readme`
    );
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in (err as any) &&
      String((err as any).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err as any;
    }
    console.error("ConnectorPage SSR error", err);
    return (
      <div className="container mx-auto py-16">
        <h1 className="text-xl font-semibold">Something went wrong.</h1>
        <p className="text-sm text-muted-foreground mt-2">Please refresh and try again.</p>
      </div>
    );
  }
}
