import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function LoginPage() {
    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex flex-col items-center gap-3 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                        <Building2 className="h-8 w-8" />
                    </span>
                    <div className="flex flex-col">
                        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">Shibalik Block B</h1>
                        <p className="text-sm text-muted-foreground">Society Ledger</p>
                    </div>
                </div>
                <Card className="rounded-2xl shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-xl">Editor Login</CardTitle>
                        <CardDescription>Enter your credentials to access the dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
