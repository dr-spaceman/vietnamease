/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  fallbacks: {
    // Failed page requests fallback to this.
    document: '/~offline',
  },
})

module.exports = withPWA(nextConfig)
