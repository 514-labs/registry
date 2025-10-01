import PipelineCard from "@/components/pipeline-card";
import { cn } from "@/lib/utils";

export type DiscoverPipeline = {
  name: string;
  description: string;
  icon: string; // path relative to public
  href: string;
  tags: string[];

  languages?: string[];
  comingSoon?: boolean;
  implementationCount?: number;

  // Optional meta visualizations / filters
  sourceType?: string;
  extraction?: "batch" | "stream";
  domains?: string[];

  // Scheduling and endpoints
  scheduleCron?: string;
  scheduleTimezone?: string;
  sourceSystem?: string;
  destinationSystem?: string;
  fromIcon?: string;
  toIcon?: string;

  // Creators
  creatorAvatarUrl?: string;
  creatorAvatarUrls?: string[];
};

export default function PipelineDiscoverGrid({
  pipelines,
  className,
}: {
  pipelines: DiscoverPipeline[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-5 @xl/main:grid-cols-2 @5xl/main:grid-cols-3",
        className
      )}
    >
      {pipelines.map((p) => (
        <PipelineCard
          key={p.name}
          name={p.name}
          description={p.description}
          icon={p.icon}
          tags={p.tags}
          href={p.href}
          languages={p.languages}
          comingSoon={p.comingSoon}
          implementationCount={p.implementationCount}
          creatorAvatarUrl={p.creatorAvatarUrl}
          creatorAvatarUrls={p.creatorAvatarUrls}
          sourceSystem={p.sourceSystem}
          destinationSystem={p.destinationSystem}
          scheduleCron={p.scheduleCron}
          scheduleTimezone={p.scheduleTimezone}
          fromIcon={p.fromIcon}
          toIcon={p.toIcon}
        />
      ))}
    </div>
  );
}
