'use client';
import PublicDashboard from '@/components/public-dashboard';
import { financialStatements, meetingMinutes } from '@/data';

export default function PublicPage() {
  const sortedMinutes = [...meetingMinutes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedStatements = [...financialStatements].sort((a,b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime());

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Community Documents
        </h1>
        <p className="text-muted-foreground mb-6">
          Access official meeting minutes and financial statements.
        </p>
      </div>
      <PublicDashboard
        meetingMinutes={sortedMinutes}
        financialStatements={sortedStatements}
      />
    </>
  );
}
