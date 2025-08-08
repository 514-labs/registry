import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/card";
import { Badge } from "@ui/components/badge";
import type { LucideIcon } from "lucide-react";
import { Button } from "@ui/components/button";

interface ConnectorCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
}

function ConnectorCard({
  name,
  description,
  icon: Icon,
  tags,
}: ConnectorCardProps) {
  return (
    <Card>
      <CardHeader className="items-center gap-5">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-5 items-start">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
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
