import ConnectorCard from "@/components/connector-card";
import Link from "next/link";
import { ChartLine, CreditCard } from "lucide-react";
import { Button } from "@ui/components/button";

function Hero() {
  return (
    <div className="flex flex-col text-center items-center container py-16 max-w-2xl gap-4 mx-auto">
      <h1 className="text-5xl">
        Bullet-proof, customizable, connectors... as actual code
      </h1>
      <h2 className="text-lg text-muted-foreground">
        A starter kit for building, testing and sharing connectors that can be
        customomized and embedded in apps.
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

const connectors = [
  {
    name: "Google Analytics",
    description: "Capture events and metrics from Google Analytics",
    icon: "connector-logos/GoogleAnalytics.png",
    tags: ["Product Analytics", "Events", "SaaS"],
  },
  {
    name: "Stripe",
    description: "Pull your up-to-date Stripe data into your data warehouse",
    icon: "connector-logos/Stripe.png",
    tags: ["Product Analytics", "Events", "Extract", "SaaS"],
  },
  {
    name: "Segment",
    description: "Capture events and metrics from Segment",
    icon: "connector-logos/Segment.png",
    tags: ["CDP", "Events", "SaaS"],
  },
  {
    name: "Shopify",
    description: "Pull your up-to-date Shopify data into your data warehouse",
    icon: "connector-logos/Shopify.png",
    tags: ["Ecommerce", "Events", "Extract", "SaaS"],
  },
  {
    name: "MySQL",
    description:
      "Pull your transactional data from MySQL into your data warehouse",
    icon: "connector-logos/mysql.png",
    tags: ["Database", "Extract", "CDC"],
  },
  {
    name: "PostgreSQL",
    description:
      "Extract your transactional data from PostgreSQL into your data warehouse",
    icon: "connector-logos/PostgreSQL.png",
    tags: ["Database", "Extract", "CDC"],
  },
  {
    name: "Datadog ",
    description:
      "Pull your up-to-date Datadog telemetry into your observability data warehouse",
    icon: "connector-logos/Datadog.png",
    tags: ["Observability", "Events", "Extract", "SaaS"],
  },
  {
    name: "MongoDB",
    description:
      "Extract your transactional data from MongoDB into your data warehouse",
    icon: "connector-logos/DBMongo.png",
    tags: ["Database", "Extract", "CDC"],
  },
];

export default function Home() {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen space-y-4">
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
            />
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center">
        <span>
          Inspired by
          <Link
            className="pl-1"
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
            className="pl-1"
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
