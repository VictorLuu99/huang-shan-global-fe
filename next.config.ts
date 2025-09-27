import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuration for Cloudflare Pages with static export
  output: 'export',
  trailingSlash: true,

  // Optimize for production deployment
  productionBrowserSourceMaps: false,
  compress: true,

  // Image optimization for static export
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'huangshan-api.xox-labs-server.workers.dev',
      },
      {
        protocol: 'https',
        hostname: '*.xox-labs-server.workers.dev',
      },
    ],
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Skip build static optimization for dynamic routes
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

  // Custom webpack configuration for optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }

    return config
  },

  // Note: Headers are configured in wrangler.toml for Cloudflare Pages
}

export default nextConfig
