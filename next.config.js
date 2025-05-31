/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/familytree',
  assetPrefix: '/familytree',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig