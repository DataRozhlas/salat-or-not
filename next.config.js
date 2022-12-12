/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: "/salat-or-not",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
