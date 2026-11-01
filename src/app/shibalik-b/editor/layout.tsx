import { LogoutButton } from '@/components/logout-button';
import { BookCopy } from 'lucide-react';
import Link from 'next/link';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex w-full flex-row items-center gap-5 text-sm font-medium">
          <Link
            href="/shibalik-b/editor"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <BookCopy className="h-6 w-6" />
            <span>Editor Dashboard</span>
          </Link>
        </nav>
        <div className="flex items-center gap-4 md:ml-auto">
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
