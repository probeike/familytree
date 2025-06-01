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
  env: {
    // Make environment variables available in the client
    FAMILY_TREE_PASSWORD: process.env.FAMILY_TREE_PASSWORD,
    FAMILY_TREE_PASSWORD_HASH: process.env.FAMILY_TREE_PASSWORD_HASH,
    FAMILY_TREE_DATA_REPO: process.env.FAMILY_TREE_DATA_REPO,
  },
}

module.exports = nextConfig