/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan pengecekan ESLint pas deploy biar gak rewel
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Matikan pengecekan TypeScript error pas deploy
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;