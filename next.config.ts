import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow hot reloading when the dev server is opened via 127.0.0.1 instead of localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
