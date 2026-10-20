import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: "export" as const, basePath, images: { unoptimized: true } } : {}),
  poweredByHeader: false,
  typedRoutes: true,
  trailingSlash: true,
  ...(!isGitHubPages ? {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
          ]
        }
      ];
    }
  } : {})
};

export default nextConfig;
