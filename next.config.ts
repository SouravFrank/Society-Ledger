import type { NextConfig } from 'next';
import path from 'path';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
// If you are deploying to GitHub Pages, set the GITHUB_PAGES environment variable to 'true'
const repo = 'Society-Ledger';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: isGithubPages ? `/${repo}` : '',
  assetPrefix: isGithubPages ? `/${repo}/` : '',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['fs'],
  },
};

export default nextConfig;
