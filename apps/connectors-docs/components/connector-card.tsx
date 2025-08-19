import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/card";
import { Badge } from "@ui/components/badge";
import Image from "next/image";
import Link from "next/link";
import ReactionsBadge from "@/components/ReactionsBadge";

// Utility function to escape HTML entities
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ConnectorCardProps {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  href: string;
  language?: string;
  languages?: string[];
  sourceType?: string;
  domains?: string[];
  comingSoon?: boolean;
  implementationCount?: number;
  reactions?: number;
  creatorAvatarUrl?: string;
  creatorAvatarUrls?: string[];
  issueUrls?: string[];
}

function ConnectorCard({
  name,
  description,
  icon,
  tags,
  href,
  language,
  languages,
  sourceType,
  domains,
  comingSoon,
  implementationCount,
  reactions,
  creatorAvatarUrl,
  creatorAvatarUrls,
  issueUrls,
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
    <Link
      href={href}
      className="block h-full"
      aria-label={`View ${escapeHtml(name)}`}
    >
      <Card className="h-full group cursor-pointer transition-colors hover:bg-muted/40">
        <CardHeader className="flex flex-row items-start justify-between">
          <Image
            src={imageSrc}
            alt={`${name} logo`}
            width={48}
            height={48}
            className="h-12 w-12 rounded-sm object-contain 0"
          />
          <div className="flex items-center gap-2">
            {typeof implementationCount === "number" &&
            implementationCount > 0 ? (
              <Badge variant="secondary" className="text-sm">
                {implementationCount} impls
              </Badge>
            ) : null}
            {comingSoon ? (
              <Badge variant="secondary" className="text-sm">
                Coming soon
              </Badge>
            ) : null}
            <ReactionsBadge urls={issueUrls} initial={reactions} />
          </div>
        </CardHeader>
        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 grow">
          {creatorAvatarUrls && creatorAvatarUrls.length > 0 ? (
            <div className="flex -space-x-2">
              {creatorAvatarUrls.slice(0, 5).map((url, idx) => (
                <Image
                  key={`${url}-${idx}`}
                  src={url}
                  alt="Creator avatar"
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full ring-1 ring-background"
                  unoptimized
                />
              ))}
              {creatorAvatarUrls.length > 5 ? (
                <div className="h-6 w-6 rounded-full bg-muted text-xs flex items-center justify-center ring-1 ring-background">
                  +{creatorAvatarUrls.length - 5}
                </div>
              ) : null}
            </div>
          ) : creatorAvatarUrl ? (
            <Image
              src={creatorAvatarUrl}
              alt="Creator avatar"
              width={24}
              height={24}
              className="h-6 w-6 rounded-full mt-2"
              unoptimized
            />
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-start">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-2">
            {(languages && languages.length > 0
              ? languages
              : language
                ? [language]
                : []
            ).map((lang) => (
              <Badge key={`lang-${lang}`} variant="secondary">
                {lang}
              </Badge>
            ))}
            {sourceType ? (
              <Badge key={`type-${sourceType}`} variant="secondary">
                {sourceType}
              </Badge>
            ) : null}
            {(domains ?? []).map((d) => (
              <Badge key={`domain-${d}`} variant="secondary">
                {d}
              </Badge>
            ))}
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default ConnectorCard;
