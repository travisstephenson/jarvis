import type { NextConfig } from "next";

const config: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@remotion/renderer", "@remotion/bundler", "playwright"],
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default config;
