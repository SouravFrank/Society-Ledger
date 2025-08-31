import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';
// If you are deploying to GitHub Pages, set the GITHUB_PAGES environment variable to 'true'
export const repoName = 'Society-Ledger';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
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
      // The remote pattern from the second config is a duplicate, so we don't need to add it again.
    ],
  },
};

export default nextConfig;