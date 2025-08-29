'use client';

import { useState, useTransition, useEffect } from 'react';
import { format } from 'date-fns';
import {
  addFinancialStatementAction,
  addMeetingMinuteAction,
} from '@/lib/actions';
import type { FinancialStatement, MeetingMinute } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

  const handleMinuteSubmit = (formData: FormData) => {
      if (!minuteDate || !minuteUrl || !minuteTitle) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please provide a date and a valid Google Drive link.' });
          return;
      }
      formData.set('date', format(minuteDate, 'yyyy-MM-dd'));
      formData.set('title', minuteTitle);
      formData.set('url', minuteUrl);
      
      startTransition(async () => {
        const result = await addMeetingMinuteAction(formData);
        if (result?.success) {
            toast({ title: 'Success', description: 'Meeting minute added.' });
            setMinuteDate(undefined);
            setMinuteUrl('');
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result?.error || 'Failed to add meeting minute.' });
        }
      });
  }

  const handleStatementSubmit = (formData: FormData) => {
    if (!statementUrl || !statementTitle) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please provide a period and a valid Google Drive link.' });
        return;
    }
    
    formData.set('period', `${statementPeriod.year}-${String(statementPeriod.month).padStart(2, '0')}`);
    formData.set('title', statementTitle);
    formData.set('url', statementUrl);
    
    startTransition(async () => {
        const result = await addFinancialStatementAction(formData);
        if (result?.success) {
            toast({ title: 'Success', description: 'Financial statement added.' });
            setStatementUrl('');
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result?.error || 'Failed to add financial statement.' });
        }
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
                    <Button type="submit" disabled={isPending || !minuteUrl || !minuteDate}>{isPending ? "Saving..." : "Save Minute"}</Button>
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
                    <Button type="submit" disabled={isPending || !statementUrl}>{isPending ? "Saving..." : "Save Statement"}</Button>
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
