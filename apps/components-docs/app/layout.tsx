import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@ui/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@ui/components/sidebar";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connectors by 514",
  description: "Build, own, and share connectors as actual code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <ThemeProvider defaultTheme="system">
          <SidebarProvider className="flex flex-col [--header-height:calc(--spacing(14))]">
            <SiteHeader />
            {children}
          </SidebarProvider>
        </ThemeProvider>
        {/* Pagefind default UI styling (optional minimal), safe to include */}
        <Script id="pagefind-preload" strategy="afterInteractive">
          {`
            // noop placeholder for future pagefind.init() preloading hooks
          `}
        </Script>
      </body>
    </html>
  );
}
