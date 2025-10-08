"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@ui/components/badge";
import { Label } from "@ui/components/label";
import { RadioGroup, RadioGroupItem } from "@ui/components/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@ui/components/button";

type SidebarSectionItem = {
  value: string;
  label: string;
  href: string;
  iconUrl?: string | null;
};

export type PipelineImplSidebarProps = {
  fromLogoSrc: string;
  toLogoSrc: string;
  title: string;
  description?: string;
  tags?: string[];
  sourceHref?: string | null;
  sourceName?: string | null;
  destinationName?: string | null;
  viewSourceHref?: string;

  creators: SidebarSectionItem[];
  versions: SidebarSectionItem[];
  languages: SidebarSectionItem[];
  implementations: SidebarSectionItem[];

  selectedCreator: string;
  selectedVersion: string;
  selectedLanguage: string;
  selectedImplementation: string;
};

export default function PipelineImplSidebar(props: PipelineImplSidebarProps) {
  const {
    fromLogoSrc,
    toLogoSrc,
    title,
    description,
    tags = [],
    sourceHref,
    sourceName,
    destinationName,
    viewSourceHref,
    creators,
    versions,
    languages,
    implementations,
    selectedCreator,
    selectedVersion,
    selectedLanguage,
    selectedImplementation,
  } = props;

  const router = useRouter();

  const renderSection = (
    id: string,
    label: string,
    value: string,
    items: SidebarSectionItem[]
  ) => {
    const hasChoices = items.length > 1;
    return (
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
        {hasChoices ? (
          <RadioGroup
            value={value}
            onValueChange={(v) => {
              const target = items.find((i) => i.value === v);
              if (target) router.push(target.href);
            }}
            className="gap-2"
          >
            {items.map((item) => (
              <Label key={`${id}-${item.value}`} className="gap-3">
                <RadioGroupItem value={item.value} />
                {item.iconUrl ? (
                  <Avatar className="size-4">
                    <AvatarImage src={item.iconUrl} alt="" />
                    <AvatarFallback className="text-[10px]">
                      {item.label.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                <span className="text-sm">{item.label}</span>
              </Label>
            ))}
          </RadioGroup>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={`${id}-${item.value}`}
                className="flex items-center gap-3 text-sm"
              >
                {item.iconUrl ? (
                  <Avatar className="size-4">
                    <AvatarImage src={item.iconUrl} alt="" />
                    <AvatarFallback className="text-[10px]">
                      {item.label.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Image
          src={fromLogoSrc}
          alt={`from logo`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-sm object-contain "
        />
        <span className="text-muted-foreground">→</span>
        <Image
          src={toLogoSrc}
          alt={`to logo`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-sm object-contain "
        />
      </div>

      <h1 className="text-2xl ">{title}</h1>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      {viewSourceHref ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={viewSourceHref} target="_blank" rel="noopener noreferrer">
            <SiGithub className="h-4 w-4" />
            View Source
          </Link>
        </Button>
      ) : null}

      {description ? (
        <p className="text-muted-foreground">{description}</p>
      ) : null}

      {/* Source and Destination sections */}
      <div className="space-y-6">
        {sourceHref && sourceName ? (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-medium">
              Source
            </div>
            <Link
              href={sourceHref}
              className="text-sm hover:underline underline-offset-4"
            >
              {sourceName}
            </Link>
          </div>
        ) : null}
        {destinationName ? (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-medium">
              Destination
            </div>
            <div className="text-sm">{destinationName}</div>
          </div>
        ) : null}

        {renderSection("creator", "Author", selectedCreator, creators)}
        {renderSection("version", "Version", selectedVersion, versions)}
        {renderSection("language", "Language", selectedLanguage, languages)}
        {renderSection(
          "implementation",
          "Implementation",
          selectedImplementation,
          implementations
        )}
      </div>
    </div>
  );
}
