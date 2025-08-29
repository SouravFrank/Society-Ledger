'use client';

import { useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { format } from 'date-fns';
import {
  addFinancialStatementAction,
  addMeetingMinuteAction,
  generateDescriptionAction,
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
import { Textarea } from './ui/textarea';
import { Sparkles } from 'lucide-react';

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


  // Meeting Minutes Form State
  const [minuteDate, setMinuteDate] = useState<Date | undefined>();
  const [minuteFile, setMinuteFile] = useState<File | null>(null);
  const [minuteTitle, setMinuteTitle] = useState('');
  const [minuteSummary, setMinuteSummary] = useState('');
  const [isGeneratingMinuteDesc, setIsGeneratingMinuteDesc] = useState(false);
  
  // Financial Statements Form State
  const [statementPeriod, setStatementPeriod] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [statementFile, setStatementFile] = useState<File | null>(null);
  const [statementTitle, setStatementTitle] = useState('');
  const [statementSummary, setStatementSummary] = useState('');
  const [isGeneratingStatementDesc, setIsGeneratingStatementDesc] = useState(false);

  const [minuteFormState, minuteFormAction] = useFormState(addMeetingMinuteAction, undefined);
  const [statementFormState, statementFormAction] = useFormState(addFinancialStatementAction, undefined);

  const handleGenerateDesc = async (type: 'meetingMinutes' | 'financialStatement') => {
    const file = type === 'meetingMinutes' ? minuteFile : statementFile;
    if (!file) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a file first.' });
      return;
    }
    
    if(type === 'meetingMinutes') setIsGeneratingMinuteDesc(true);
    else setIsGeneratingStatementDesc(true);

    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = async () => {
        const content = fileReader.result as string;
        const result = await generateDescriptionAction(type, content);

        if (result.success && result.data) {
          if (type === 'meetingMinutes') {
            setMinuteTitle(result.data.title);
            setMinuteSummary(result.data.summary);
          } else {
            setStatementTitle(result.data.title);
            setStatementSummary(result.data.summary);
          }
          toast({ title: 'Success', description: 'Description generated successfully.' });
        } else {
          toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        
        if(type === 'meetingMinutes') setIsGeneratingMinuteDesc(false);
        else setIsGeneratingStatementDesc(false);
    }
  };

  const handleMinuteSubmit = (formData: FormData) => {
      if (!minuteDate || !minuteFile || !minuteTitle || !minuteSummary) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields for the meeting minute.' });
          return;
      }
      formData.set('date', format(minuteDate, 'yyyy-MM-dd'));
      formData.set('title', minuteTitle);
      formData.set('summary', minuteSummary);
      formData.set('file', minuteFile);
      
      startTransition(async () => {
        const result = await addMeetingMinuteAction(formData);
        if (result?.success) {
            toast({ title: 'Success', description: 'Meeting minute added.' });
            setMinuteDate(undefined);
            setMinuteFile(null);
            setMinuteTitle('');
            setMinuteSummary('');
            // Reset file input
            const fileInput = document.getElementById('minute-file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result?.error || 'Failed to add meeting minute.' });
        }
      });
  }

  const handleStatementSubmit = (formData: FormData) => {
    if (!statementFile || !statementTitle || !statementSummary) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields for the financial statement.' });
        return;
    }
    
    formData.set('period', `${statementPeriod.year}-${String(statementPeriod.month).padStart(2, '0')}`);
    formData.set('title', statementTitle);
    formData.set('summary', statementSummary);
    formData.set('file', statementFile);
    
    startTransition(async () => {
        const result = await addFinancialStatementAction(formData);
        if (result?.success) {
            toast({ title: 'Success', description: 'Financial statement added.' });
            setStatementFile(null);
            setStatementTitle('');
            setStatementSummary('');
             // Reset file input
            const fileInput = document.getElementById('statement-file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result?.error || 'Failed to add financial statement.' });
        }
    });
  }

  return (
    <Tabs defaultValue="minutes">
      <TabsList>
        <TabsTrigger value="minutes">Meeting Minutes</TabsTrigger>
        <TabsTrigger value="statements">Financial Statements</TabsTrigger>
      </TabsList>
      
      <TabsContent value="minutes">
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Meeting Minutes</CardTitle>
                    <CardDescription>Upload a PDF of the meeting minutes.</CardDescription>
                </CardHeader>
                <form action={handleMinuteSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Meeting Date</Label>
                        <DatePicker date={minuteDate} setDate={setMinuteDate} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minute-file">PDF File</Label>
                        <Input id="minute-file" name="file" type="file" accept=".pdf" onChange={(e) => setMinuteFile(e.target.files?.[0] || null)} />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleGenerateDesc('meetingMinutes')} disabled={!minuteFile || isGeneratingMinuteDesc}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGeneratingMinuteDesc ? 'Generating...' : 'Generate Title & Summary'}
                    </Button>
                    <div className="space-y-2">
                        <Label htmlFor="minute-title">Title</Label>
                        <Input id="minute-title" name="title" value={minuteTitle} onChange={(e) => setMinuteTitle(e.target.value)} placeholder="AI-generated title..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minute-summary">Summary</Label>
                        <Textarea id="minute-summary" name="summary" value={minuteSummary} onChange={(e) => setMinuteSummary(e.target.value)} placeholder="AI-generated summary..." />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Minute"}</Button>
                </CardFooter>
                </form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Existing Meeting Minutes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialMeetingMinutes.map((minute) => (
                                <TableRow key={minute.date}>
                                    <TableCell>{format(new Date(minute.date), 'PPP')}</TableCell>
                                    <TableCell>{minute.title}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </TabsContent>

      <TabsContent value="statements">
      <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Financial Statement</CardTitle>
                    <CardDescription>Upload an image of the financial statement.</CardDescription>
                </CardHeader>
                 <form action={handleStatementSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Statement Period</Label>
                        <MonthYearPicker period={statementPeriod} onPeriodChange={setStatementPeriod} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="statement-file">Image File</Label>
                        <Input id="statement-file" name="file" type="file" accept="image/*" onChange={(e) => setStatementFile(e.target.files?.[0] || null)} />
                    </div>
                     <Button type="button" variant="outline" size="sm" onClick={() => handleGenerateDesc('financialStatement')} disabled={!statementFile || isGeneratingStatementDesc}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGeneratingStatementDesc ? 'Generating...' : 'Generate Title & Summary'}
                    </Button>
                    <div className="space-y-2">
                        <Label htmlFor="statement-title">Title</Label>
                        <Input id="statement-title" name="title" value={statementTitle} onChange={(e) => setStatementTitle(e.target.value)} placeholder="AI-generated title..."/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="statement-summary">Summary</Label>
                        <Textarea id="statement-summary" name="summary" value={statementSummary} onChange={(e) => setStatementSummary(e.target.value)} placeholder="AI-generated summary..." />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Statement"}</Button>
                </CardFooter>
                </form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Existing Financial Statements</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
