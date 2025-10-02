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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@ui/components/sheet";
import { Menu } from "lucide-react";

export async function SiteHeader() {
  const githubStars = await getGithubStars();

  return (
    <header className="flex justify-between items-center p-4 w-full h-[var(--header-height)] sticky top-0 z-10 bg-background">
      <div className="flex flex-row items-center gap-2 h-full">
        <Button asChild variant="link" className="px-1">
          <Link href="/">
            <Image
              src="/logo-medium-black.png"
              alt="Registry by 514"
              width={160}
              height={24}
              priority
              className="h-6 w-auto block dark:hidden"
            />
            <Image
              src="/logo-medium-white.png"
              alt="Registry by 514"
              width={160}
              height={24}
              priority
              className="h-6 w-auto hidden dark:block"
            />
          </Link>
        </Button>
        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-row items-center gap-2">
          <NavButton href="/discover" label="Discover" />
          <NavButton href="/create" label="Create" />
          <NavButton href="/request" label="Request" />
        </div>
      </div>
      
      <div className="flex flex-row items-center gap-2 h-full">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-row items-center gap-2">
          <NavButton href="/docs" label="Docs" />
          <SearchButton />
          <SidebarTrigger />
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="h-7 px-2">
            <Link
              href="https://github.com/514-labs/registry"
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

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6 !h-full !min-h-screen">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-0">
                <div className="flex flex-col gap-2">
                  <Button asChild variant="ghost" className="justify-start h-auto p-3">
                    <Link href="/discover">Discover</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-auto p-3">
                    <Link href="/create">Create</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-auto p-3">
                    <Link href="/request">Request</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-auto p-3">
                    <Link href="/docs">Docs</Link>
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <SearchButton />
                  <SidebarTrigger />
                </div>
                <Button asChild variant="ghost" size="sm" className="h-7 px-2 justify-start">
                  <Link
                    href="https://github.com/514-labs/registry"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub repository"
                  >
                    <SiGithub className="size-4 mr-2" />
                    GitHub
                    {githubStars != null && (
                      <span className="text-xs tabular-nums ml-auto">
                        {new Intl.NumberFormat(undefined, {
                          notation: "compact",
                        }).format(githubStars)}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
