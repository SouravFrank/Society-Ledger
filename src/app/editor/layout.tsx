import { Button } from '@/components/ui/button';
import { logoutAction } from '@/lib/actions';
import { BookCopy, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <BookCopy className="h-6 w-6" />
            <span className="sr-only">Society Ledger</span>
          </Link>
          <Link
            href="/editor"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            <form action={logoutAction}>
                <Button variant="outline" size="sm" type="submit">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
