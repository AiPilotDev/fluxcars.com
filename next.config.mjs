/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.fluxcars.com',
        pathname: '/assets/**',
      }
    ],
  },
}

export default nextConfig;