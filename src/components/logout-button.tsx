'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    router.push('/shibalik-b/login');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleLogout}
      className="h-9 w-9 shrink-0 rounded-xl sm:h-10 sm:w-auto sm:rounded-md sm:px-4"
      aria-label="Logout"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
}
