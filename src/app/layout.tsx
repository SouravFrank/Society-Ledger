import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { repoName } from '../../next.config';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// Mirror the GitHub Pages base path handling used across the static export.
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? `/${repoName}` : '';

export const metadata: Metadata = {
  title: 'Society Ledger',
  description: 'Meeting minutes and financial statements for your society.',
  manifest: `${basePath}/manifest.webmanifest`,
  // Make the site behave like a standalone app when added to a home screen.
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Society Ledger',
  },
  icons: {
    icon: [{ url: `${basePath}/resources/app-icon.svg`, type: 'image/svg+xml' }],
    apple: [{ url: `${basePath}/resources/app-icon.svg` }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#9ac663',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          inter.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
