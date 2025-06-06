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
      'oaidalleapiprodscus.blob.core.windows.net',
      'www.google.com', // allow Google images
      'media.istockphoto.com', // allow iStockPhoto images
      'placehold.co', // allow placeholder images
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;