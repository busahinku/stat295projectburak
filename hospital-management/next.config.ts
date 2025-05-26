/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false, // Keep type checking enabled
  },
  images: {
    domains: ['localhost'],
    unoptimized: true, // For easier deployment
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
}

export default nextConfig
