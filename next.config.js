/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
}

module.exports = nextConfig
