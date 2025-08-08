import Link from "next/link";
import { ThemeToggle } from "@ui/components/theme-toggle";
import { Button } from "@ui/components/button";
import { SidebarTrigger } from "@ui/components/sidebar";

export function SiteHeader() {
  return (
    <header className="flex justify-between items-center p-4 w-full h-[var(--header-height)] sticky top-0 z-10 bg-background">
      <div className="flex items-center gap-2">
        <Button asChild variant="link">
          <Link href="/">Connectors</Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/thesis">Discover</Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/thesis">Publish</Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/thesis">Host</Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/docs">Docs</Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <ThemeToggle />
      </div>
    </header>
  );
}
