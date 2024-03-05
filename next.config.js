/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  fallbacks: {
    document: '/~offline',
  },
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  cacheStartUrl: true,
  dynamicStartUrl: true,
})

module.exports = withPWA(nextConfig)
