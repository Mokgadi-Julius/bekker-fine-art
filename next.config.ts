import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' for Railway deployment to enable server-side features
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
