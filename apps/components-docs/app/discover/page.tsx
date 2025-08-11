import { listRegistry } from "@workspace/registry";
import type { ConnectorRootMeta } from "@workspace/registry/types";
import DiscoverGrid from "@/app/discover/DiscoverGrid";

export default function DiscoverPage() {
  const registry = listRegistry();
  const connectors = registry.map((conn) => {
    const meta = (conn.root.meta ?? {}) as ConnectorRootMeta;
    const displayName = (meta.title ?? meta.name ?? conn.connectorId) as string;
    const description = (meta.description ?? "") as string;
    const tags = (meta.tags ?? []) as string[];
    const iconName = displayName.replace(/\s+/g, "");
    return {
      name: displayName,
      description,
      tags,
      icon: `connector-logos/${iconName}.png`,
      href: `/connectors/${conn.connectorId}`,
    };
  });

  return <DiscoverGrid connectors={connectors} />;
}
