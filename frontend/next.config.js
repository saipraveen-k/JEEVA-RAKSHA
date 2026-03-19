/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    // Fix for hashSalt error in newer Next.js versions
    esmExternals: false,
  },
}

module.exports = nextConfig
