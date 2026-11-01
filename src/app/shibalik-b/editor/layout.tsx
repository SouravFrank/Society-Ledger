import { LogoutButton } from '@/components/logout-button';
import { BookCopy } from 'lucide-react';
import Link from 'next/link';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-muted/30">
      <header className="pt-safe sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
          <Link
            href="/shibalik-b/editor"
            className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BookCopy className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-headline text-sm font-bold tracking-tight text-foreground">
                Editor Dashboard
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                Society Ledger
              </span>
            </span>
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 md:pb-24">
        {children}
      </main>
    </div>
  );
}
