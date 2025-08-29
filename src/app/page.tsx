import { Header } from '@/components/header';
import PublicDashboard from '@/components/public-dashboard';
import { getFinancialStatements, getMeetingMinutes } from '@/lib/db';

export default async function Home() {
  const meetingMinutes = await getMeetingMinutes();
  const financialStatements = await getFinancialStatements();
console.log("hi", meetingMinutes)
  return (
    <>
      <Header />
      <main className="flex-1">
        <PublicDashboard
          meetingMinutes={meetingMinutes}
          financialStatements={financialStatements}
        />
      </main>
    </>
  );
}
