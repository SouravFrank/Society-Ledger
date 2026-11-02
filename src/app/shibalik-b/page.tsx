'use client';
import PublicDashboard from '@/components/public-dashboard';
import { financialStatements, ironGuardStatus, meetingMinutes } from '@/data';
import Image from 'next/image';
import { repoName } from '../../../next.config';

export default function PublicPage() {
  const sortedMinutes = [...meetingMinutes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedStatements = [...financialStatements].sort((a,b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime());
  const isGithubPages = process.env.GITHUB_PAGES === 'true';
  const imageSource = `${isGithubPages ? `/${repoName}` : ""}/resources/letter-header-only.png`;

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <Image
            src={imageSource}
            alt="Shibalik Apartment (Block B)"
            width={2480}
            height={676}
            className="h-auto w-full"
            priority
            data-ai-hint="header graphic"
          />
        </div>
        <div className="mb-1 mt-4">
          <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground">
            Community Documents
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access official meeting minutes and financial statements.
          </p>
        </div>
      </div>
      <PublicDashboard
        meetingMinutes={sortedMinutes}
        financialStatements={sortedStatements}
        ironGuardStatus={ironGuardStatus}
      />
    </>
  );
}
