'use client';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy } from "lucide-react";

export default function ClientLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const match = typeof document !== 'undefined'
      ? document.cookie.split('; ').find(c => c.trim().startsWith('auth_token='))
      : undefined;
    const token = match ? decodeURIComponent(match.split('=')[1] || '') : '';
    if (token === 'editor-secret-token') {
      router.push('/shibalik-b/editor');
    }
  }, [router]);

  const from = searchParams?.get('from') || '/shibalik-b/editor';

  return (
    <main className="flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <BookCopy className="h-8 w-8 mr-2" />
              <h1 className="text-2xl font-headline font-bold">Society Ledger</h1>
            </div>
            <CardTitle className="text-2xl font-headline">Editor Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo={from} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}