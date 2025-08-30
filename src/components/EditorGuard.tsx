import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const match = typeof document !== 'undefined'
      ? document.cookie.split('; ').find(c => c.trim().startsWith('auth_token='))
      : undefined;
    const token = match ? decodeURIComponent(match.split('=')[1] || '') : '';

    if (!token || token !== 'editor-secret-token') {
      const from = window.location.pathname;
      router.push(`/shibalik-b/login?from=${encodeURIComponent(from)}`);
    }
  }, [router]);

  return <>{children}</>;
}