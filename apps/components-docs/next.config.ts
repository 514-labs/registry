import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["@workspace/registry"],
  // Export to static HTML so Pagefind can index the built site in ./out
  output: "export",
  images: {
    // Required for `output: 'export'` when using next/image
    unoptimized: true,
  },
  /* config options here */
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
