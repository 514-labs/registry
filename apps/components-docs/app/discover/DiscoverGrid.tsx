"use client";

import ConnectorCard from "@/components/connector-card";
import { Input } from "@ui/components/input";
import { useMemo, useState } from "react";

type DiscoverConnector = {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  href: string;
};

export default function DiscoverGrid({
  connectors,
}: {
  connectors: DiscoverConnector[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return connectors;
    return connectors.filter((c) => {
      const haystack =
        `${c.name} ${c.description} ${c.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [connectors, query]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 lg:px-6 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Discover connectors</h1>
      </div>
      <div className="mb-6">
        <Input
          placeholder="Search connectors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {filtered.map((connector) => (
          <ConnectorCard key={connector.name} {...connector} />
        ))}
      </div>
    </main>
  );
}
