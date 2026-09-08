import type { NextConfig } from "next";
import cities from "./content/cities.json";

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      // The old WordPress city parent pages were empty shells; the content lives one level deeper.
      ...cities.map((c) => ({
        source: `/${c.slug}`,
        destination: `/${c.slug}/haushaltsaufloesung/`,
        permanent: true,
      })),
      { source: "/category/allgemein", destination: "/ratgeber/", permanent: true },
      { source: "/tag/:tag", destination: "/ratgeber/", permanent: true },
      { source: "/feed", destination: "/ratgeber/", permanent: true },
      { source: "/wp-content/uploads/:path*", destination: "https://www.nrw-haushaltsaufloesung.de/wp-content/uploads/:path*", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
