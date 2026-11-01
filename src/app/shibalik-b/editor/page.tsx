'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import EditorDashboard from "@/components/editor-dashboard";
import { financialStatements, meetingMinutes } from "@/data";

export default function EditorPage() {
    const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');
        if (token === 'editor-secret-token') {
            setAuthStatus('authenticated');
        } else {
            setAuthStatus('unauthenticated');
            router.replace('/shibalik-b/login');
        }
    }, [router]);

    if (authStatus === 'checking' || authStatus === 'unauthenticated') {
        return (
            <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Verifying access...</p>
            </div>
        );
    }

    const sortedMinutes = [...meetingMinutes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const sortedStatements = [...financialStatements].sort((a,b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime());

    return (
        <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight">Manage Documents</h1>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Add or review meeting minutes and financial statements.
            </p>
            <EditorDashboard
                initialMeetingMinutes={sortedMinutes}
                initialFinancialStatements={sortedStatements}
            />
        </div>
    )
}
