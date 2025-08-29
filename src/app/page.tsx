import { Header } from '@/components/header';
import PublicDashboard from '@/components/public-dashboard';
import { getFinancialStatements, getMeetingMinutes } from '@/lib/db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const meetingMinutes = await getMeetingMinutes();
  const financialStatements = await getFinancialStatements();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Community Documents
          </h1>
          <p className="text-muted-foreground mb-6">
            Access official meeting minutes and financial statements.
          </p>
          <Button asChild>
            <Link href="/editor">Go to Editor</Link>
          </Button>
        </div>
        <PublicDashboard
          meetingMinutes={meetingMinutes}
          financialStatements={financialStatements}
        />
      </main>
    </>
  );
}
