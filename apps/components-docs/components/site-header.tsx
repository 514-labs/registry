import Link from "next/link";
import Image from "next/image";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ThemeToggle } from "@ui/components/theme-toggle";
import { Button } from "@ui/components/button";
import { SidebarTrigger } from "@ui/components/sidebar";
import { SearchButton } from "@/components/search";
import { getGithubStars } from "@/app/actions/get-github-stars";

export async function SiteHeader() {
  const githubStars = await getGithubStars();

  return (
    <header className="flex justify-between items-center p-4 w-full h-[var(--header-height)] sticky top-0 z-10 bg-background">
      <div className="flex items-center gap-2">
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
        <Button asChild variant="link">
          <Link href="/discover">Discover</Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/create">Create</Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/share">Share</Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <SearchButton />
        <Button asChild variant="link">
          <Link href="/docs">Docs</Link>
        </Button>
        <SidebarTrigger />
        <ThemeToggle />
        <Button asChild variant="ghost" size="sm" className="h-7 px-2">
          <Link
            href="https://github.com/514-labs/connector-factory"
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
