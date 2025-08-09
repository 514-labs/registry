"use client";

import ConnectorCard from "@/components/connector-card";
import { connectors } from "@/lib/connectors-mock";
import { Input } from "@ui/components/input";
import { useState } from "react";

export default function DiscoverPage() {
  // Simple client-side filter (case-insensitive)
  const [query, setQuery] = useState("");
  const filtered = connectors.filter((c) => {
    const haystack =
      `${c.name} ${c.description} ${c.tags.join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

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
