"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@ui/components/badge";
import { Label } from "@ui/components/label";
import { RadioGroup, RadioGroupItem } from "@ui/components/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import { GitBranch, Code2, Wrench } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@ui/components/button";

type SidebarSectionItem = {
  value: string;
  label: string;
  href: string;
  iconUrl?: string | null;
  icon?: React.ReactNode;
};

export type ConnectorImplSidebarProps = {
  logoSrc: string;
  title: string;
  identifier: string;
  description?: string;
  tags?: string[];
  sourceHref?: string;
  reactionsHref?: string;
  reactionsCount?: number;
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

export default function ConnectorImplSidebar(props: ConnectorImplSidebarProps) {
  const {
    logoSrc,
    title,
    identifier,
    description,
    tags = [],
    sourceHref,
    reactionsHref,
    reactionsCount,
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
                ) : item.icon ? (
                  <span className="text-muted-foreground">{item.icon}</span>
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
                ) : item.icon ? (
                  <span className="text-muted-foreground">{item.icon}</span>
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
      <Image
        src={logoSrc}
        alt={`${title} logo`}
        width={48}
        height={48}
        className="h-12 w-12 rounded-sm object-contain "
      />
      <h1 className="text-2xl ">{title}</h1>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {sourceHref ? (
            <Badge variant="secondary">
              <Link href={sourceHref} className="flex items-center gap-1">
                <span>Source</span>
              </Link>
            </Badge>
          ) : null}
          {reactionsHref ? (
            <Badge variant="secondary">
              <Link href={reactionsHref} className="flex items-center gap-1">
                <span>👍</span>
                <span className="-ml-1">❤️</span>
                <span>{reactionsCount ?? 0}</span>
              </Link>
            </Badge>
          ) : null}
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

      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">
          Identifier
        </div>
        <code className="text-sm font-mono">{identifier}</code>
      </div>

      <div className="space-y-6">
        {renderSection(
          "creator",
          "Author",
          selectedCreator,
          creators.map((c) => ({ ...c }))
        )}
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
