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
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen space-y-4">
      <main className="flex flex-col items-center sm:items-start">
        <Hero />
        {/* Connectors */}
        <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
          <ConnectorCard
            name="Google Analytics"
            description="Capture events and metrics from Google Analytics"
            icon={ChartLine}
            tags={["Product Analytics", "Events", "SaaS"]}
          />
          <ConnectorCard
            name="Stripe"
            description="Capture events and metrics from Stripe"
            icon={CreditCard}
            tags={["Product Analytics", "Events", "SaaS"]}
          />
          <ConnectorCard
            name="Segment"
            description="Capture events and metrics from Segment"
            icon={ChartLine}
            tags={["Product Analytics", "Events", "SaaS"]}
          />
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
