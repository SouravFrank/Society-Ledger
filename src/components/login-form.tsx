'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { editorCredentials } from '@/data/credentials';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isGithubPages = process.env.GITHUB_PAGES === 'true';
  const repoName = 'Society-Ledger';
  const basePath = isGithubPages ? `/${repoName}` : '';
  const editorUrl = `${basePath}/shibalik-b/editor`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    setTimeout(() => {
      if (
        username === editorCredentials.username &&
        password === editorCredentials.password
      ) {
        sessionStorage.setItem('auth_token', 'editor-secret-token');
        router.push(editorUrl);
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid username or password.',
        });
      }
      setIsPending(false);
    }, 500);
  };
  
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          className="h-11 rounded-xl"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          className="h-11 rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending} className="h-11 w-full rounded-xl text-base font-semibold">
        {isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
