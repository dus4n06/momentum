import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
typescript: {
  ignoreBuildErrors: true,
},
eslint: {
  ignoreDuringBuilds: true,
},

export default nextConfig;
