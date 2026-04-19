import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-4567787b-6e66-4901-a1e5-73353df71a51.space.z.ai",
    ".space.z.ai",
  ],
};

export default nextConfig;
