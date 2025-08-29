'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/lib/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          required
        />
      </div>
      <div className="space-y-2">
        <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="Password"
            required 
        />
      </div>
      <SubmitButton />
    </form>
  );
}
