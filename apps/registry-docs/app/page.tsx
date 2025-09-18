import Link from "next/link";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { PagefindMeta } from "@/components/pagefind-meta";
import {
  buildDiscoverConnectors,
  buildDiscoverPipelines,
} from "@/lib/discover";
import { Wrench, BadgeCheck, Activity, ScrollText } from "lucide-react";

import { DiscoveryGrid } from "./discover/discovery-grids";

const valueProps = [
  {
    text: "Composable and easy to tweak",
    icon: <Wrench />,
  },
  {
    text: "Best practices backed in",
    icon: <BadgeCheck />,
  },
  {
    text: "Easy to monitor, debug and scale",
    icon: <Activity />,
  },
  {
    text: "Own it. MIT License Forever",
    icon: <ScrollText />,
  },
];

function Hero() {
  return (
    <div className="grid grid-cols-2 gap-5 py-16">
      <div className="flex flex-col gap-10">
        {/* <Badge variant="outline">
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
        </Badge> */}
        <h1 className="text-6xl mb-0">
          <span className="text-muted-foreground">
            Embeddable components for
          </span>{" "}
          analytical systems
        </h1>
        <div className="flex flex-row gap-5">
          <Button asChild>
            <Link href="/discover">Discover all</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <h2 className="text-lg text-muted-foreground">
          A starter kit for building, testing and sharing the components you
          need to build out a scalable analytical system. Frontend teams have
          used design systems and components thinking for years, we’re now
          bringing that to analytics. Heavily inspired by Shadcn/ui.
        </h2>
        <div className="flex flex-col gap-5 text-lg">
          {valueProps.map((prop) => (
            <div key={prop.text} className="flex flex-row gap-5 items-center">
              {prop.icon}
              {prop.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const [connectors, pipelines] = await Promise.all([
    buildDiscoverConnectors(),
    buildDiscoverPipelines(),
  ]);

  return (
    <div className="font-sans items-center justify-items-center min-h-screen space-y-4">
      <PagefindMeta type="docs" />
      <main className="flex flex-col items-center sm:items-start container max-w-6xl mx-auto">
        <Hero />
        <DiscoveryGrid connectors={connectors} pipelines={pipelines} />
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
