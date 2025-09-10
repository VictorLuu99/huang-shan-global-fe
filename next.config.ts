import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuration for Cloudflare Pages with Edge Runtime
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
    ],
  },
  // Asset prefix for Cloudflare Pages
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/vinfast-viethung' : '',
}

export default nextConfig
