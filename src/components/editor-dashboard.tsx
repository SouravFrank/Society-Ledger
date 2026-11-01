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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DatePicker } from './ui/date-picker';
import { MonthYearPicker } from './month-year-picker';

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
    <Tabs defaultValue="minutes">
      <div className="flex justify-start mb-6">
        <TabsList>
            <TabsTrigger value="minutes">Meeting Minutes</TabsTrigger>
            <TabsTrigger value="statements">Financial Statements</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="minutes">
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Meeting Minutes</CardTitle>
                    <CardDescription>Enter the Google Drive link for the meeting minutes PDF.</CardDescription>
                </CardHeader>
                <form action={handleMinuteSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Meeting Date</Label>
                        <DatePicker date={minuteDate} setDate={setMinuteDate} />
                         {minuteTitle && <p className="text-sm text-muted-foreground pt-1">Generated Title: "{minuteTitle}"</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minute-url">Google Drive Link</Label>
                        <Input id="minute-url" name="url" type="text" placeholder="https://drive.google.com/file/d/..." value={minuteUrl} onChange={(e) => setMinuteUrl(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={!minuteUrl || !minuteDate}>Save Minute</Button>
                </CardFooter>
                </form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Existing Meeting Minutes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Title</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialMeetingMinutes.map((minute) => (
                                    <TableRow key={minute.id}>
                                        <TableCell>{format(new Date(minute.date), 'PPP')}</TableCell>
                                        <TableCell>{minute.title}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
      </TabsContent>

      <TabsContent value="statements">
      <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Financial Statement</CardTitle>
                    <CardDescription>Enter the Google Drive link for the financial statement image.</CardDescription>
                </CardHeader>
                 <form action={handleStatementSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Statement Period</Label>
                        <MonthYearPicker period={statementPeriod} onPeriodChange={setStatementPeriod} />
                         {statementTitle && <p className="text-sm text-muted-foreground pt-1">Generated Title: "{statementTitle}"</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="statement-url">Google Drive Link</Label>
                        <Input id="statement-url" name="url" type="text" placeholder="https://drive.google.com/file/d/..." value={statementUrl} onChange={(e) => setStatementUrl(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={!statementUrl}>Save Statement</Button>
                </CardFooter>
                </form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Existing Financial Statements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Title</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialFinancialStatements.map((statement) => (
                                    <TableRow key={statement.period}>
                                        <TableCell>{format(new Date(statement.period + '-02'), 'MMMM yyyy')}</TableCell>
                                        <TableCell>{statement.title}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
