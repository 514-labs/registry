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
