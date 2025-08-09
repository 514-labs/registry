import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/card";
import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ConnectorCardProps {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  accentColor: string;
}

function ConnectorCard({
  name,
  description,
  icon,
  tags,
  accentColor,
}: ConnectorCardProps) {
  const imageSrc = icon.startsWith("/") ? icon : `/${icon}`;
  return (
    <Card className="h-full">
      <CardHeader>
        <Card className="h-full overflow-hidden p-0">
          <div className="relative p-8">
            <Image
              src={imageSrc}
              alt={`${name} logo`}
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
      </CardHeader>
      <CardHeader className="items-center ">
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-5 items-start">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Button variant="outline">View Connector</Button>
      </CardFooter>
    </Card>
  );
}

export default ConnectorCard;
