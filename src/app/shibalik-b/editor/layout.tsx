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
    <div className="flex min-h-screen w-full flex-col editor-bg">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-b-white/20 bg-black/20 px-4 md:px-6 backdrop-blur-lg">
        <nav className="flex w-full flex-row items-center gap-5 text-sm font-medium">
          <Link
            href="/shibalik-b/editor"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-white"
          >
            <BookCopy className="h-6 w-6" />
            <span>Editor Dashboard</span>
          </Link>
        </nav>
        <div className="flex items-center gap-4 md:ml-auto">
          <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
              </Button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
