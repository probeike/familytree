/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/familytree' : '',
  assetPrefix: isProd ? '/familytree' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig