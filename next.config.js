/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/family-tree-app',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig