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

// Utility function to escape HTML entities
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface PipelineCardProps {
  fromIcon?: string;
  toIcon?: string;
  name: string;
  description: string;
  icon: string; // path relative to public
  href: string;
  tags: string[];

  languages?: string[];
  comingSoon?: boolean;
  implementationCount?: number;
  reactions?: number;

  // Optional meta visualizations
  sourceSystem?: string; // e.g., "google-analytics"
  destinationSystem?: string; // e.g., "clickhouse"
  scheduleCron?: string; // e.g., "0 * * * *"
  scheduleTimezone?: string; // e.g., "UTC"

  // Creators
  creatorAvatarUrl?: string;
  creatorAvatarUrls?: string[];
}

export default function PipelineCard({
  fromIcon,
  toIcon,
  name,
  description,
  icon,
  href,
  tags,
  languages,
  comingSoon,
  implementationCount,
  reactions,
  sourceSystem,
  destinationSystem,
  scheduleCron,
  scheduleTimezone,
  creatorAvatarUrl,
  creatorAvatarUrls,
}: PipelineCardProps) {
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
  const fallbackFrom = sourceSystem
    ? `/connector-logos/${sourceSystem}.png`
    : undefined;
  const fallbackTo = destinationSystem
    ? `/connector-logos/${destinationSystem}.png`
    : undefined;
  const sourceLogo = fromIcon || fallbackFrom;
  const destinationLogo = toIcon || fallbackTo;
  const scheduleText =
    scheduleCron || scheduleTimezone
      ? `${scheduleCron ?? ""}${scheduleCron && scheduleTimezone ? " " : ""}${scheduleTimezone ?? ""}`.trim()
      : undefined;

  return (
    <Link
      href={href}
      className="block h-full"
      aria-label={`View ${escapeHtml(name)}`}
    >
      <Card className="h-full group cursor-pointer transition-colors hover:bg-muted/40">
        <CardHeader className="flex flex-row items-start justify-between">
          {sourceLogo || destinationLogo ? (
            <div className="flex items-center gap-2">
              {sourceLogo ? (
                <Image
                  src={sourceLogo}
                  alt={`${sourceSystem} logo`}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-sm object-contain"
                />
              ) : null}
              <span className="text-muted-foreground">→</span>
              {destinationLogo ? (
                <Image
                  src={destinationLogo}
                  alt={`${destinationSystem} logo`}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-sm object-contain"
                />
              ) : null}
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt={`${name} logo`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-sm object-contain 0"
            />
          )}
          <div className="flex items-center gap-2">
            {typeof implementationCount === "number" &&
            implementationCount > 0 ? (
              <Badge variant="secondary" className="text-sm">
                {implementationCount} {implementationCount === 1 ? "implementation" : "implementations"}
              </Badge>
            ) : null}
            {comingSoon ? (
              <Badge variant="secondary" className="text-sm flex items-center gap-1">
                <span>Requested</span>
                <span>|</span>
                <span>👍</span>
                <span>{reactions ?? 0}</span>
              </Badge>
            ) : typeof reactions === "number" && reactions > 0 ? (
              <Badge
                variant="secondary"
                className="text-sm flex items-center gap-1"
              >
                <span>❤️</span>
                <span className="-ml-1">👍</span>
                <span>{reactions}</span>
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 grow">
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

          {/* Optional pipeline meta summaries */}
          {sourceSystem || destinationSystem ? (
            <div className="text-xs text-muted-foreground">
              {(sourceSystem ?? "").trim()}{" "}
              {sourceSystem && destinationSystem ? "→" : ""}{" "}
              {(destinationSystem ?? "").trim()}
            </div>
          ) : null}
          {scheduleText ? (
            <div className="text-xs text-muted-foreground">
              Schedule: {scheduleText}
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 items-start">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-2">
            {(languages ?? []).map((lang) => (
              <Badge key={`lang-${lang}`} variant="secondary">
                {lang}
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
