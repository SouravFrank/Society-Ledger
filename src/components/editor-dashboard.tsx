'use client';

import { useState, useTransition, useEffect } from 'react';
import { format } from 'date-fns';
import {
  addFinancialStatementAction,
  addMeetingMinuteAction,
} from '@/lib/actions';
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
import { useRouter } from 'next/navigation';

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

  // Meeting Minutes Form State
  const [minuteDate, setMinuteDate] = useState<Date | undefined>();
  const [minuteFile, setMinuteFile] = useState<File | null>(null);
  const [minuteTitle, setMinuteTitle] = useState('');
  
  // Financial Statements Form State
  const [statementPeriod, setStatementPeriod] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [statementFile, setStatementFile] = useState<File | null>(null);
  const [statementTitle, setStatementTitle] = useState('');

  useEffect(() => {
    if (minuteDate) {
      setMinuteTitle(format(minuteDate, 'MMMM d yyyy \'Summery\''));
    } else {
      setMinuteTitle('');
    }
  }, [minuteDate]);

  useEffect(() => {
    const date = new Date(statementPeriod.year, statementPeriod.month - 1);
    setStatementTitle(format(date, 'MMMM yyyy \'Financial Statement\''));
  }, [statementPeriod]);


  const handleMinuteSubmit = (formData: FormData) => {
      if (!minuteDate || !minuteFile || !minuteTitle) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields for the meeting minute.' });
          return;
      }
      formData.set('date', format(minuteDate, 'yyyy-MM-dd'));
      formData.set('title', minuteTitle);
      formData.set('file', minuteFile);
      
      startTransition(async () => {
        const result = await addMeetingMinuteAction(formData);
        if (result?.success) {
            toast({ title: 'Success', description: 'Meeting minute added.' });
            setMinuteDate(undefined);
            setMinuteFile(null);
            // Reset file input
            const fileInput = document.getElementById('minute-file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result?.error || 'Failed to add meeting minute.' });
        }
      });
  }

  const handleStatementSubmit = (formData: FormData) => {
    if (!statementFile || !statementTitle) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields for the financial statement.' });
        return;
    }
    
    formData.set('period', `${statementPeriod.year}-${String(statementPeriod.month).padStart(2, '0')}`);
    formData.set('title', statementTitle);
    formData.set('file', statementFile);
    
    startTransition(async () => {
        const result = await addFinancialStatementAction(formData);
        if (result?.success) {
            toast({ title: 'Success', description: 'Financial statement added.' });
            setStatementFile(null);
             // Reset file input
            const fileInput = document.getElementById('statement-file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result?.error || 'Failed to add financial statement.' });
        }
    });
  }
  
  const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg ${className}`}>
      {children}
    </div>
  );

  return (
    <Tabs defaultValue="minutes">
      <div className="flex justify-center mb-6">
        <TabsList className="bg-white/20 border border-white/20">
            <TabsTrigger value="minutes" className="data-[state=active]:bg-white/20">Meeting Minutes</TabsTrigger>
            <TabsTrigger value="statements" className="data-[state=active]:bg-white/20">Financial Statements</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="minutes">
        <div className="grid gap-8 md:grid-cols-2">
            <GlassCard>
                <CardHeader>
                    <CardTitle className="text-white">Upload Meeting Minutes</CardTitle>
                    <CardDescription className="text-gray-200">Upload a PDF of the meeting minutes.</CardDescription>
                </CardHeader>
                <form action={handleMinuteSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-gray-200">Meeting Date</Label>
                        <DatePicker date={minuteDate} setDate={setMinuteDate} />
                    </div>
                     {minuteTitle && <p className="text-sm text-gray-300 italic">Title: "{minuteTitle}"</p>}
                    <div className="space-y-2">
                        <Label htmlFor="minute-file" className="text-gray-200">PDF File</Label>
                        <Input id="minute-file" name="file" type="file" accept=".pdf" onChange={(e) => setMinuteFile(e.target.files?.[0] || null)} className="text-gray-200 file:text-gray-300"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending || !minuteFile || !minuteDate} className="bg-white/20 hover:bg-white/30 text-white">{isPending ? "Saving..." : "Save Minute"}</Button>
                </CardFooter>
                </form>
            </GlassCard>
            <GlassCard>
                <CardHeader>
                    <CardTitle className="text-white">Existing Meeting Minutes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/20">
                                    <TableHead className="text-gray-200">Date</TableHead>
                                    <TableHead className="text-gray-200">Title</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialMeetingMinutes.map((minute) => (
                                    <TableRow key={minute.id} className="border-white/20">
                                        <TableCell className="text-gray-300">{format(new Date(minute.date), 'PPP')}</TableCell>
                                        <TableCell className="text-gray-300">{minute.title}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </GlassCard>
        </div>
      </TabsContent>

      <TabsContent value="statements">
      <div className="grid gap-8 md:grid-cols-2">
            <GlassCard>
                <CardHeader>
                    <CardTitle className="text-white">Upload Financial Statement</CardTitle>
                    <CardDescription className="text-gray-200">Upload an image of the financial statement.</CardDescription>
                </CardHeader>
                 <form action={handleStatementSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-gray-200">Statement Period</Label>
                        <MonthYearPicker period={statementPeriod} onPeriodChange={setStatementPeriod} />
                    </div>
                    {statementTitle && <p className="text-sm text-gray-300 italic">Title: "{statementTitle}"</p>}
                    <div className="space-y-2">
                        <Label htmlFor="statement-file" className="text-gray-200">Image File</Label>
                        <Input id="statement-file" name="file" type="file" accept="image/*" onChange={(e) => setStatementFile(e.target.files?.[0] || null)} className="text-gray-200 file:text-gray-300"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending || !statementFile} className="bg-white/20 hover:bg-white/30 text-white">{isPending ? "Saving..." : "Save Statement"}</Button>
                </CardFooter>
                </form>
            </GlassCard>
            <GlassCard>
                <CardHeader>
                    <CardTitle className="text-white">Existing Financial Statements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/20">
                                    <TableHead className="text-gray-200">Period</TableHead>
                                    <TableHead className="text-gray-200">Title</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialFinancialStatements.map((statement) => (
                                    <TableRow key={statement.period} className="border-white/20">
                                        <TableCell className="text-gray-300">{format(new Date(statement.period + '-02'), 'MMMM yyyy')}</TableCell>
                                        <TableCell className="text-gray-300">{statement.title}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </GlassCard>
        </div>
      </TabsContent>
    </Tabs>
  );
}
