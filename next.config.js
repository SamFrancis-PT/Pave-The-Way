/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'playground.bravebrand.com',
      },
    ],
  },
}

module.exports = nextConfig
