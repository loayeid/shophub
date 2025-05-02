/** @type {import('next').NextConfig} */
const nextConfig = {
  //DO NOT put output: 'export' here!
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;

