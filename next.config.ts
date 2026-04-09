import createMDX from "@next/mdx";
import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    root: path.join(process.cwd()),
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
