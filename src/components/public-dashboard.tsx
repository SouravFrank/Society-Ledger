'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { FinancialStatement, MeetingMinute } from '@/lib/types';
import { groupBy } from 'lodash';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import {
  CalendarDays,
  ChevronRight,
  FileImage,
  FileText,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

type TabId = 'minutes' | 'statements' | 'iron-guard';

const NAV_ITEMS: { id: TabId; label: string; fullLabel: string; icon: typeof FileText }[] = [
  { id: 'minutes', label: 'Minutes', fullLabel: 'Meeting Summery', icon: FileText },
  { id: 'statements', label: 'Statements', fullLabel: 'Financial Statements', icon: FileImage },
  { id: 'iron-guard', label: 'Iron Guard', fullLabel: 'Iron Guard Finances', icon: ShieldCheck },
];

interface PublicDashboardProps {
  meetingMinutes: MeetingMinute[];
  financialStatements: FinancialStatement[];
  // optional iron guard status (single image)
  ironGuardStatus?: { url: string };
}

export default function PublicDashboard({
  meetingMinutes,
  financialStatements,
  ironGuardStatus,
}: PublicDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('minutes');
  const [selectedStatement, setSelectedStatement] = useState<FinancialStatement | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<MeetingMinute | null>(null);
  const [selectedIronGuard, setSelectedIronGuard] = useState<FinancialStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Group meeting minutes by year in descending order
  const groupedMeetingMinutes = Object.entries(
    groupBy(meetingMinutes, (minute) => new Date(minute.date).getFullYear())
  ).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));

  // Group financial statements by year in descending order
  const groupedFinancialStatements = Object.entries(
    groupBy(financialStatements, (statement) => new Date(statement.period + '-01').getFullYear())
  ).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));

  // helper to extract Drive file id
  const extractDriveFileId = (url: string) => {
    const fileIdMatch = url.match(/file\/d\/(.*?)\//) || url.match(/[?&]id=([^&]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  };

  const getDriveImageUrl = (url: string) => {
    const id = extractDriveFileId(url);
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    return url;
  };

  const getViewerUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const isPreview = url.endsWith('/preview');
      const finalUrl = isPreview ? url : url.replace('/view', '/preview').replace('?usp=sharing', '');

      const fileIdMatch = finalUrl.match(/file\/d\/(.*?)\//);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  };

  return (
    <>
      <div className="pb-28 sm:pb-8">
        {/* Desktop: pill-style tab row */}
        <div className="hidden sm:block">
          <div className="mx-auto mb-6 flex w-full max-w-3xl justify-center">
            <div className="inline-flex h-12 items-center gap-1 rounded-full bg-muted/60 p-1 shadow-sm ring-1 ring-border">
              {NAV_ITEMS.map(({ id, fullLabel, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                  className={
                    'inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors ' +
                    (activeTab === id
                      ? 'bg-background text-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  <Icon className="h-5 w-5" />
                  {fullLabel}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: bottom tab bar */}
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-md sm:hidden">
          <div className="mx-auto grid max-w-3xl grid-cols-3">
            {NAV_ITEMS.map(({ id, label, fullLabel, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-label={fullLabel}
                aria-current={activeTab === id ? 'page' : undefined}
                className={
                  'relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ' +
                  (activeTab === id
                    ? 'text-primary'
                    : 'text-muted-foreground active:text-primary')
                }
              >
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <Icon className="h-5 w-5" />
                  {activeTab === id && (
                    <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-primary" />
                  )}
                </span>
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="mx-auto w-full max-w-3xl px-4">
          {/* Meeting Minutes: year-grouped, tappable list */}
          {activeTab === 'minutes' && (
            groupedMeetingMinutes.map(([year, minutes]) => (
              <section key={year} className="mb-6">
                <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {year}
                </h3>
                <div className="divide-y overflow-hidden rounded-2xl border bg-card shadow-sm">
                  {(minutes as MeetingMinute[]).map((minute) => (
                    <button
                      key={minute.date}
                      onClick={() => {
                        setSelectedMinute(minute);
                        setIsLoading(true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-primary/10"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[15px] font-semibold text-foreground">
                          {format(new Date(minute.date), 'MMMM dd, yyyy')}
                        </span>
                        <span className="text-xs text-muted-foreground">Meeting minutes</span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/60" />
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Financial Statements: year-grouped, tappable list */}
          {activeTab === 'statements' && (
            groupedFinancialStatements.map(([year, statements]) => (
              <section key={year} className="mb-6">
                <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {year}
                </h3>
                <div className="divide-y overflow-hidden rounded-2xl border bg-card shadow-sm">
                  {(statements as FinancialStatement[]).map((statement) => (
                    <button
                      key={statement.period}
                      onClick={() => {
                        setSelectedStatement(statement);
                        setIsLoading(true);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-primary/10"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FileImage className="h-5 w-5" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[15px] font-semibold text-foreground">
                          {format(new Date(statement.period + '-01'), 'MMMM yyyy')}
                        </span>
                        <span className="text-xs text-muted-foreground">Financial statement</span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/60" />
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Iron Guard Fund: feature card */}
          {activeTab === 'iron-guard' && (
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                  <ShieldCheck className="h-7 w-7" />
                </span>
                <h3 className="font-headline mt-4 text-lg font-bold text-foreground">
                  Iron Guard Fund Status
                </h3>
                <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                  View the latest status image of the Iron Guard fund.
                </p>
              </div>
              <div className="p-4">
                <Button
                  className="h-12 w-full rounded-xl text-base font-semibold"
                  disabled={!ironGuardStatus}
                  onClick={() => {
                    if (ironGuardStatus) {
                      // use the existing iframe viewer by setting selectedStatement
                      setSelectedStatement({ period: 'iron-guard', url: ironGuardStatus.url });
                      setIsLoading(true);
                      // clear any image-specific selection
                      setSelectedIronGuard(null);
                    }
                  }}
                >
                  See Latest Status
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen document viewer on mobile, modal on desktop */}
      <Dialog open={!!selectedStatement || !!selectedMinute || !!selectedIronGuard} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedStatement(null);
          setSelectedMinute(null);
          setSelectedIronGuard(null);
          setIsLoading(false);
        }
      }}>
        {(selectedStatement?.url || selectedMinute?.url || selectedIronGuard?.url) && (
          <DialogContent className="h-[100dvh] w-full max-w-none gap-0 rounded-none border-0 p-0 sm:h-[88vh] sm:max-w-4xl sm:rounded-2xl sm:p-4">
            <DialogHeader className="flex-row items-center border-b p-4 sm:border-0 sm:p-0">
              <DialogTitle className="flex-1 truncate pr-12 text-base sm:pr-10">
                {selectedStatement
                  ? selectedStatement.period === 'iron-guard'
                    ? 'Iron Guard Fund Status'
                    : format(new Date(selectedStatement.period + '-01'), 'MMMM yyyy')
                  : selectedIronGuard
                  ? format(new Date(selectedIronGuard.period + '-01'), 'MMMM yyyy')
                  : selectedMinute
                  ? format(new Date(selectedMinute.date), 'MMMM dd, yyyy')
                  : 'No Date Available'}
              </DialogTitle>
            </DialogHeader>
            <div className="relative mt-0 min-h-0 flex-1 bg-white sm:mt-3 sm:rounded-xl">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/80">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                </div>
              )}
              {selectedIronGuard ? (
                <img
                  src={getDriveImageUrl(selectedIronGuard.url)}
                  alt={`Iron Guard Status ${selectedIronGuard.period}`}
                  className="max-h-[80vh] w-full rounded-md object-contain"
                  onLoad={() => setIsLoading(false)}
                />
              ) : (
                <iframe
                  key={selectedStatement ? `statement-${selectedStatement.period}` : `minute-${selectedMinute?.date}`}
                  src={getViewerUrl(selectedStatement?.url || selectedMinute?.url || '')}
                  className="h-full w-full rounded-md border-0"
                  title={selectedStatement?.formattedDate || selectedMinute?.formattedDate || 'No Date Available'}
                  onLoad={() => setIsLoading(false)}
                />
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
