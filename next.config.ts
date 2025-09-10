import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Only use static export for production builds, not for development
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true, // Required for static export
    },
  }),
  images: {
    remotePatterns: [
    ],
  },
  // Asset prefix for Cloudflare Pages
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/vinfast-viethung' : '',
}

export default nextConfig
