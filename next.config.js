/** @type {import('next').NextConfig} */
const nextConfig = {
  //DO NOT put output: 'export' here!
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'pixabay.com',
      'cdn.pixabay.com',
      'via.placeholder.com',
      'images.pexels.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;