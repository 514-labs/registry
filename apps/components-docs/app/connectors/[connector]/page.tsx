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
  const { connector } = await params;
  const conn = readConnector(connector);
  if (!conn) return null;

  const firstProvider = conn.providers[0];
  if (!firstProvider) return null;
  const version = basename(dirname(firstProvider.path));
  const language = firstProvider.implementations[0]?.language ?? "typescript";
  const creator = firstProvider.authorId;
  const implementation =
    firstProvider.implementations[0]?.implementation ?? "default";

  redirect(
    `/connectors/${connector}/${version}/${creator}/${language}/${implementation}?page=readme`
  );
}
