import type { NextConfig } from "next";

// GitHub Pages serves project sites from a sub-path (https://<user>.github.io/<repo>),
// so the base path/asset prefix are only applied when building for that target
// (set via the GITHUB_PAGES_BASE_PATH env var in the deploy workflow). Local dev
// and `next start` continue to run from the root path unmodified.
const basePath = process.env.GITHUB_PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export — this app is 100% client-side (state lives in
  // localStorage, no API routes/server actions), so it can be hosted
  // entirely as static files on GitHub Pages.
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // GitHub Pages serves files literally, so routes need a trailing slash
  // (e.g. /quiz/index.html) rather than relying on server rewrites.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
