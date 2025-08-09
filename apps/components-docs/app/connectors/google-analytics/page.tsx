import { cn } from "@/lib/utils";
import { Badge } from "@ui/components/badge";
import { Card } from "@ui/components/card";
import Image from "next/image";

const connector = {
  name: "Google Analytics",
  description: "Subscribe to Google Analytics events and metrics",
  icon: "connector-logos/GoogleAnalytics.png",
  tags: ["Product Analytics", "Events", "SaaS"],
  href: "/connectors/google-analytics",
};

function ConnectorMeta() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="h-full overflow-hidden p-0">
        <div className="relative p-8">
          <Image
            src={`/${connector.icon}`}
            alt={`${connector.name} logo`}
            width={48}
            height={48}
            className="h-12 w-12 rounded-sm object-contain mx-auto relative z-10"
          />
          <div
            className={cn(
              "bg-gradient-to-b h-full w-full  blur-sm absolute top-0 left-0",
              "from-60% from-card",
              "to-neutral-500/20"
            )}
          />
        </div>
      </Card>
      <h1 className="text-2xl ">{connector.name}</h1>
      <p className="text-muted-foreground">{connector.description}</p>
      <div className="flex flex-row gap-2">
        {connector.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function GoogleAnalytics() {
  return (
    <div className="container mx-auto py-16 ">
      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-4">
          <ConnectorMeta />
        </div>
        <div className="col-span-8">
          <div className="prose dark:prose-invert">
            <h1>Get Started</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleAnalytics;
