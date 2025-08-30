
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookCopy } from 'lucide-react';
import Head from 'next/head';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Fallback redirect for clients with JavaScript enabled but slow initial load
    router.replace('/shibalik-b');
  }, [router]);

  return (
    <>
      <Head>
        {/* Meta refresh is the fastest way to redirect on static sites */}
        <meta httpEquiv="refresh" content="0;url=/shibalik-b" />
        <title>Redirecting...</title>
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-full w-full animate-pulse rounded-full bg-primary/20"></div>
            <BookCopy className="z-10 h-8 w-8 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">
              Society Ledger
            </h1>
            <p className="text-muted-foreground">
              Loading community documents...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
