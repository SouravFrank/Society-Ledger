'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/lib/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending} className="w-full">{pending ? 'Logging in...' : 'Login'}</Button>;
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: state.error,
      })
    }
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="editor@example.com"
          defaultValue="editor@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
            id="password" 
            name="password" 
            type="password" 
            defaultValue="password"
            required 
        />
      </div>
      <SubmitButton />
    </form>
  );
}
