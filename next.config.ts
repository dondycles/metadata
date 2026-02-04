import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgproxy.mapia.io",
      },
    ],
  },
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
  /* config options here */
};

export default nextConfig;
