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
import Link from "next/link";

interface ConnectorCardProps {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  href: string;
}

function ConnectorCard({
  name,
  description,
  icon,
  tags,
  href,
}: ConnectorCardProps) {
  const base = icon.startsWith("/") ? icon : `/${icon}`;
  const candidates = [
    base,
    base.replace(/\.png$/, ".svg"),
    base.replace(/\.png$/, ".webp"),
    base.replace(/\.png$/, ".jpg"),
    base.replace(/\.png$/, ".jpeg"),
  ];
  // Use first candidate; browser will 404 fallbacks are not automatic, but primary will exist after sync
  const imageSrc = candidates[0];
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
        <Button variant="outline" asChild>
          <Link href={href}>View Connector</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ConnectorCard;
