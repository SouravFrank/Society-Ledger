
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
            <div className="absolute h-full w-full animate-pulse rounded-2xl bg-primary/20"></div>
            <span className="z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <BookCopy className="h-6 w-6" />
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-headline text-xl font-bold text-foreground">
              Society Ledger
            </h1>
            <p className="text-sm text-muted-foreground">
              Loading Shibalik Apartment Block B documents...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
