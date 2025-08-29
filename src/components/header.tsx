import Link from 'next/link';
import { Button } from './ui/button';
import { BookCopy } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookCopy className="h-6 w-6" />
          <span className="font-bold sm:inline-block">
            Society Ledger
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Button asChild>
                <Link href="/editor">Go to Editor</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
