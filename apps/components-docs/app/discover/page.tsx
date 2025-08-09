"use client";

import ConnectorCard from "@/components/connector-card";
import { Input } from "@ui/components/input";
import { useState } from "react";

const connectors = [
  {
    name: "Google Analytics",
    description: "Capture events and metrics from Google Analytics",
    icon: "connector-logos/GoogleAnalytics.png",
    tags: ["Product Analytics", "Events", "SaaS"],
    accentColor: "hsl(var(--red-500))",
  },
  {
    name: "Stripe",
    description: "Pull your up-to-date Stripe data into your data warehouse",
    icon: "connector-logos/Stripe.png",
    tags: ["Product Analytics", "Events", "Extract", "SaaS"],
    accentColor: "hsl(var(--blue-500))",
  },
  {
    name: "Segment",
    description: "Capture events and metrics from Segment",
    icon: "connector-logos/Segment.png",
    tags: ["CDP", "Events", "SaaS"],
    accentColor: "hsl(var(--green-500))",
  },
  {
    name: "Shopify",
    description: "Pull your up-to-date Shopify data into your data warehouse",
    icon: "connector-logos/Shopify.png",
    tags: ["Ecommerce", "Events", "Extract", "SaaS"],
    accentColor: "hsl(var(--yellow-500))",
  },
  {
    name: "MySQL",
    description:
      "Pull your transactional data from MySQL into your data warehouse",
    icon: "connector-logos/mysql.png",
    tags: ["Database", "Extract", "CDC"],
    accentColor: "hsl(var(--purple-500))",
  },
  {
    name: "PostgreSQL",
    description:
      "Extract your transactional data from PostgreSQL into your data warehouse",
    icon: "connector-logos/PostgreSQL.png",
    tags: ["Database", "Extract", "CDC"],
    accentColor: "hsl(var(--pink-500))",
  },
  {
    name: "Datadog ",
    description:
      "Pull your up-to-date Datadog telemetry into your observability data warehouse",
    icon: "connector-logos/Datadog.png",
    tags: ["Observability", "Events", "Extract", "SaaS"],
    accentColor: "hsl(var(--orange-500))",
  },
  {
    name: "MongoDB",
    description:
      "Extract your transactional data from MongoDB into your data warehouse",
    icon: "connector-logos/DBMongo.png",
    tags: ["Database", "Extract", "CDC"],
    accentColor: "hsl(var(--indigo-500))",
  },
];

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
