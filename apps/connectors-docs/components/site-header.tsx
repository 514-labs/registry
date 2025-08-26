import Link from "next/link";
import Image from "next/image";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ThemeToggle } from "@ui/components/theme-toggle";
import { Button } from "@ui/components/button";
import { SidebarTrigger } from "@ui/components/sidebar";
import { SearchButton } from "@/components/search";
import { getGithubStars } from "@/app/actions/get-github-stars";
import { NavButton } from "@/components/nav-button";
import { Separator } from "@ui/components/separator";

export async function SiteHeader() {
  const githubStars = await getGithubStars();
  const pipelinesBaseUrl =
    process.env.NEXT_PUBLIC_PIPELINES_DOCS_URL || "http://localhost:3001";

  return (
    <header className="flex justify-between items-center p-4 w-full h-[var(--header-height)] sticky top-0 z-10 bg-background">
      <div className="flex flex-row items-center gap-2 h-full">
        <Button asChild variant="link">
          <Link href="/">
            <Image
              src="/logo-medium-black.png"
              alt="Connector Factory"
              width={160}
              height={24}
              priority
              className="h-6 w-auto block dark:hidden"
            />
            <Image
              src="/logo-medium-white.png"
              alt="Connector Factory"
              width={160}
              height={24}
              priority
              className="h-6 w-auto hidden dark:block"
            />
          </Link>
        </Button>
        <NavButton href="/discover" label="Discover" />
        <NavButton href="/create" label="Create" />
        <NavButton href="/share" label="Share" />
        <NavButton href="/request" label="Request" />
      </div>
      <div className="flex flex-row items-center gap-2 h-full">
        <NavButton href={pipelinesBaseUrl} label="Pipelines" />
        <Separator orientation="vertical" />
        <NavButton href="/docs" label="Docs" />
        <SearchButton />
        <SidebarTrigger />
        <ThemeToggle />
        <Button asChild variant="ghost" size="sm" className="h-7 px-2">
          <Link
            href="https://github.com/514-labs/factory"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            <SiGithub className="size-4" />
            {githubStars != null && (
              <span className="text-xs tabular-nums">
                {new Intl.NumberFormat(undefined, {
                  notation: "compact",
                }).format(githubStars)}
              </span>
            )}
          </Link>
        </Button>
      </div>
    </header>
  );
}
