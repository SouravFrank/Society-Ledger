import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Header() {
  return (
    <header className="pt-safe sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-headline text-sm font-bold tracking-tight text-foreground">
              Shibalik Block B
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              Society Ledger
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
