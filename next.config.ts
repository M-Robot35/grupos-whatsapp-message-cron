import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // Serve arquivos estáticos da pasta storage/ (uploads de usuários)
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: '/api/storage/:path*',
      },
    ]
  },
}

export default nextConfig
