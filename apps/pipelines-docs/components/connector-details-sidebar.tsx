import Image from "next/image";
import { Card } from "@ui/components/card";
import { Badge } from "@ui/components/badge";
import { cn } from "@/lib/utils";

export type ConnectorDetailsSidebarProps = {
  connectorId: string;
  displayName: string;
  description?: string;
  tagList?: string[];
  thumbsUpCount?: number;
  className?: string;
};

export function ConnectorDetailsSidebar({
  connectorId,
  displayName,
  description,
  tagList = [],
  thumbsUpCount,
  className,
}: ConnectorDetailsSidebarProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card className="p-0 bg-transparent border-none shadow-none">
        <Image
          src={`/connector-logos/${connectorId}.png`}
          alt={`${displayName} logo`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-sm object-contain"
        />
      </Card>
      <h1 className="text-xl">{displayName}</h1>
      {typeof thumbsUpCount === "number" && (
        <div className="text-sm text-muted-foreground">👍 {thumbsUpCount}</div>
      )}
      {description ? (
        <p className="text-muted-foreground">{description}</p>
      ) : null}
      {tagList.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-2">
          {tagList.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ConnectorDetailsSidebar;


