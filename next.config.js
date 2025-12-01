/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    return config
  },
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
}

module.exports = nextConfig
