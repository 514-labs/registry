import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { resolve } from "path";
import { config } from "dotenv";

// Load environment variables from monorepo root
config({ path: resolve(__dirname, "../../.env") });

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["@workspace/registry"],
  output: "standalone",
  // Ensure file tracing can include files outside the app (monorepo root)
  outputFileTracingRoot: resolve(__dirname, "../../"),
  // Include both registries so ISR/static routes can access them at runtime
  outputFileTracingIncludes: {
    "/**/*": ["../../connector-registry/**/*", "../../pipeline-registry/**/*"],
  },
  env: {
    GITHUB_PAT: process.env.GITHUB_PAT,
  },
  /* config options here */
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
