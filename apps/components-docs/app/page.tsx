import ConnectorCard from "@/components/connector-card";
import Link from "next/link";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { PagefindMeta } from "@/components/pagefind-meta";
import { listRegistry } from "@workspace/registry";
import type { ConnectorRootMeta } from "@workspace/registry/types";

function Hero() {
  return (
    <div className="flex flex-col text-center items-center container py-16 max-w-2xl gap-4 mx-auto">
      <Badge>
        This Project is a WIP. Join our{" "}
        <Link
          href="https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          slack
        </Link>{" "}
        to get involved
      </Badge>
      <h1 className="text-5xl">
        Bullet-proof, customizable, connectors... as actual code
      </h1>
      <h2 className="text-lg text-muted-foreground">
        A starter kit for building, testing and sharing analytical connectors
        that can be customized and embedded in apps.
      </h2>
      <div className="flex flex-row gap-4">
        <Button asChild>
          <Link href="discover">All connectors</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/docs">Learn More</Link>
        </Button>
      </div>
    </div>
  );
}

export default function Home() {
  const registry = listRegistry();
  const connectors = registry.map((conn) => {
    const meta = (conn.root.meta ?? {}) as ConnectorRootMeta;
    const displayName = (meta.title ?? meta.name ?? conn.connectorId) as string;
    const description = (meta.description ?? "") as string;
    const tags = (meta.tags ?? []) as string[];
    // Prefer direct public path copied from registry via sync script. Try common extensions; next/image will
    // resolve at runtime when the file exists. We default to .png for display but provide a fallback list in the card.
    return {
      name: displayName,
      description,
      tags,
      icon: `connector-logos/${conn.connectorId}.png`,
      href: `/connectors/${conn.connectorId}`,
    };
  });

  return (
    <div className="font-sans items-center justify-items-center min-h-screen space-y-4">
      <PagefindMeta type="docs" />
      <main className="flex flex-col items-center sm:items-start">
        <Hero />
        {/* Connectors */}
        <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
          {connectors.map((connector) => (
            <ConnectorCard
              key={connector.name}
              name={connector.name}
              description={connector.description}
              icon={connector.icon}
              tags={connector.tags}
              href={connector.href}
            />
          ))}
        </div>
      </main>
      <footer className="flex flex-wrap items-center justify-center py-20">
        <span>
          Inspired by
          <Link
            className="pl-1 underline"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui
          </Link>
        </span>
        <span>
          , Created with ❤️ by the folks at
          <Link
            className="pl-1 underline"
            href="https://www.fiveonefour.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            514 Labs
          </Link>
        </span>
      </footer>
    </div>
  );
}
