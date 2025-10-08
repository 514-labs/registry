"use client";

import ConnectorCard from "@/components/connector-card";
import { cn } from "@/lib/utils";

export type DiscoverConnector = {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  href: string;
  sourceType?: string; // from registry meta.category
  extraction?: "batch" | "stream"; // derived from tags/category
  domains?: string[]; // derived from tags minus operational ones
  language?: string;
  languages?: string[];
  reactions?: number;
  creatorAvatarUrl?: string;
  creatorAvatarUrls?: string[];
  comingSoon?: boolean;
  implementationCount?: number;
};

export default function ConnectorDiscoverGrid({
  connectors,
  className,
}: {
  connectors: DiscoverConnector[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5",
        className
      )}
    >
      {connectors.map((connector) => (
        <ConnectorCard
          key={connector.name}
          name={connector.name}
          description={connector.description}
          icon={connector.icon}
          tags={connector.tags}
          href={connector.href}
          language={connector.language}
          languages={connector.languages}
          sourceType={connector.sourceType}
          domains={connector.domains}
          comingSoon={connector.comingSoon}
          implementationCount={connector.implementationCount}
          reactions={connector.reactions}
          creatorAvatarUrl={connector.creatorAvatarUrl}
          creatorAvatarUrls={connector.creatorAvatarUrls}
        />
      ))}
    </div>
  );
}
