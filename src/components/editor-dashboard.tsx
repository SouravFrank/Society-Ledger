'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { FinancialStatement, MeetingMinute } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { DatePicker } from './ui/date-picker';
import { MonthYearPicker } from './month-year-picker';
import { CalendarDays, FileImage, FileText, Plus } from 'lucide-react';

interface EditorDashboardProps {
  initialMeetingMinutes: MeetingMinute[];
  initialFinancialStatements: FinancialStatement[];
}

export default function EditorDashboard({
  initialMeetingMinutes,
  initialFinancialStatements,
}: EditorDashboardProps) {
  const { toast } = useToast();

  const [minuteDate, setMinuteDate] = useState<Date | undefined>();
  const [minuteUrl, setMinuteUrl] = useState<string>('');
  const [minuteTitle, setMinuteTitle] = useState('');

  const [statementPeriod, setStatementPeriod] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [statementUrl, setStatementUrl] = useState<string>('');
  const [statementTitle, setStatementTitle] = useState('');

  useEffect(() => {
    if (minuteDate) {
      setMinuteTitle(format(minuteDate, "MMMM d yyyy 'Summery'"));
    } else {
      setMinuteTitle('');
    }
  }, [minuteDate]);

  useEffect(() => {
    const date = new Date(statementPeriod.year, statementPeriod.month - 1);
    setStatementTitle(format(date, "MMMM yyyy 'Financial Statement'"));
  }, [statementPeriod]);

  // The site is a fully static export, so documents cannot be persisted from
  // the browser — they are maintained in src/data/index.ts and deployed via git.
  const handleMinuteSubmit = () => {
      if (!minuteDate || !minuteUrl || !minuteTitle) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please provide a date and a valid Google Drive link.' });
          return;
      }

      toast({
          title: 'Uploads are disabled',
          description: 'This site is a static export. Add the document in src/data/index.ts and redeploy.',
      });
  }

  const handleStatementSubmit = () => {
    if (!statementUrl || !statementTitle) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please provide a period and a valid Google Drive link.' });
        return;
    }

    toast({
        title: 'Uploads are disabled',
        description: 'This site is a static export. Add the document in src/data/index.ts and redeploy.',
    });
  }

  return (
    <Tabs defaultValue="minutes" className="w-full">
      {/* App-style segmented control - prominent and sticky */}
      <div className="sticky top-0 z-30 border-b bg-background/80 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <TabsList className="grid h-12 w-full max-w-3xl mx-auto grid-cols-2 gap-1 bg-muted/50 p-1 rounded-2xl shadow-sm ring-1 ring-border">
            <TabsTrigger
              value="minutes"
              className="gap-1.5 rounded-xl text-[13px] font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-primary sm:gap-2 sm:text-sm"
            >
              <FileText className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" /> Meeting Minutes
            </TabsTrigger>
            <TabsTrigger
              value="statements"
              className="gap-1.5 rounded-xl text-[13px] font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-primary sm:gap-2 sm:text-sm"
            >
              <FileImage className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" /> Statements
            </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="minutes" className="mt-4 space-y-6">
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-lg">
                    <Plus className="h-5 w-5 text-primary" /> Add Meeting Minutes
                </CardTitle>
                <CardDescription>Enter the Google Drive link for the meeting minutes PDF.</CardDescription>
            </CardHeader>
            <form action={handleMinuteSubmit}>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Meeting Date</Label>
                    <DatePicker date={minuteDate} setDate={setMinuteDate} className="h-11 w-full rounded-xl" />
                     {minuteTitle && <p className="pt-1 text-sm text-muted-foreground">Generated Title: "{minuteTitle}"</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minute-url">Google Drive Link</Label>
                    <Input id="minute-url" name="url" type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" placeholder="https://drive.google.com/file/d/..." className="h-11 rounded-xl" value={minuteUrl} onChange={(e) => setMinuteUrl(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={!minuteUrl || !minuteDate} className="h-11 w-full rounded-xl font-semibold sm:w-auto">Save Minute</Button>
            </CardFooter>
            </form>
        </Card>
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Existing Meeting Minutes</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
                <div className="max-h-[420px] divide-y overflow-y-auto rounded-xl">
                    {initialMeetingMinutes.map((minute) => (
                        <div key={minute.id ?? minute.date} className="flex items-center gap-3 px-3 py-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <CalendarDays className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{format(new Date(minute.date), 'PPP')}</p>
                                <p className="truncate text-xs text-muted-foreground">{minute.title ?? 'Meeting minutes'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="statements" className="mt-4 space-y-6">
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-lg">
                    <Plus className="h-5 w-5 text-primary" /> Add Financial Statement
                </CardTitle>
                <CardDescription>Enter the Google Drive link for the financial statement image.</CardDescription>
            </CardHeader>
             <form action={handleStatementSubmit}>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Statement Period</Label>
                    <MonthYearPicker period={statementPeriod} onPeriodChange={setStatementPeriod} />
                     {statementTitle && <p className="pt-1 text-sm text-muted-foreground">Generated Title: "{statementTitle}"</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="statement-url">Google Drive Link</Label>
                    <Input id="statement-url" name="url" type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" placeholder="https://drive.google.com/file/d/..." className="h-11 rounded-xl" value={statementUrl} onChange={(e) => setStatementUrl(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={!statementUrl} className="h-11 w-full rounded-xl font-semibold sm:w-auto">Save Statement</Button>
            </CardFooter>
            </form>
        </Card>
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Existing Financial Statements</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
                <div className="max-h-[420px] divide-y overflow-y-auto rounded-xl">
                    {initialFinancialStatements.map((statement) => (
                        <div key={statement.period} className="flex items-center gap-3 px-3 py-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <FileImage className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{format(new Date(statement.period + '-02'), 'MMMM yyyy')}</p>
                                <p className="truncate text-xs text-muted-foreground">{statement.title ?? 'Financial statement'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
