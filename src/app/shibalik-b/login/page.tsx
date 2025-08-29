import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy } from "lucide-react";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <div className="flex justify-center items-center mb-4">
                            <BookCopy className="h-8 w-8 mr-2"/>
                            <h1 className="text-2xl font-headline font-bold">Society Ledger</h1>
                        </div>
                        <CardTitle className="text-2xl font-headline">Editor Login</CardTitle>
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
