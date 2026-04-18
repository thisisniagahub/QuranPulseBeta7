import type { NextConfig } from "next";

const SPA_ROUTES = [
  '/login',
  '/quran',
  '/smart-deen',
  '/ibadah',
  '/iqra',
  '/quest',
  '/surah-quest',
  '/leaderboard',
  '/subscribe',
  '/pro',
  '/souq',
  '/barakah',
  '/media',
  '/umrah',
  '/admin',
  '/profile',
  '/privacy',
  '/terms',
  '/refund',
  '/verse-studio',
  '/iqra/guides',
];

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return SPA_ROUTES.map(route => ({
      source: `${route}(/?)`,
      destination: '/quranpulse.html',
    })).concat(
      SPA_ROUTES.map(route => ({
        source: `${route}/:path*`,
        destination: '/quranpulse.html',
      }))
    );
  },
};

export default nextConfig;
