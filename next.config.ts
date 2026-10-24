import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/reception",
        destination: "/staff",
      },
      {
        source: "/reception/:path*",
        destination: "/staff/:path*",
      },
    ];
  },
};

export default nextConfig;
