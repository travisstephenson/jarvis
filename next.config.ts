import type { NextConfig } from "next";

// GitHub Pages serves this repo at `<user>.github.io/<repo>`, so we need a
// basePath in production builds. The repo name is `jarvis`.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/jarvis" : "";

const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default config;
