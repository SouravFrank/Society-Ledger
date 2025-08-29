'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { FinancialStatement, MeetingMinute } from '@/lib/types';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { MonthYearPicker } from './month-year-picker';
import { FileText, ImageIcon } from 'lucide-react';

interface PublicDashboardProps {
  meetingMinutes: MeetingMinute[];
  financialStatements: FinancialStatement[];
}

export default function PublicDashboard({
  meetingMinutes,
  financialStatements,
}: PublicDashboardProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [period, setPeriod] = useState<{ month: number, year: number }>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [selectedMinute, setSelectedMinute] = useState<MeetingMinute | null>(null);
  const [selectedStatement, setSelectedStatement] = useState<FinancialStatement | null>(null);

  const minuteDates = meetingMinutes.map(m => new Date(m.date));

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (!selectedDate) return;

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const minute = meetingMinutes.find(m => m.date === dateString);
    if (minute) {
      setSelectedMinute(minute);
    }
  };
  
  const handlePeriodSearch = () => {
    const periodString = `${period.year}-${String(period.month).padStart(2, '0')}`;
    const statement = financialStatements.find(s => s.period === periodString);
    if (statement) {
      setSelectedStatement(statement);
    } else {
      alert("No statement found for this period.")
    }
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FileText className="h-6 w-6" /> Meeting Minutes
            </CardTitle>
            <CardDescription>Select a date to view the meeting minutes.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              modifiers={{ highlighted: minuteDates }}
              modifiersStyles={{ highlighted: { border: '2px solid hsl(var(--primary))', borderRadius: 'var(--radius)'} }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <ImageIcon className="h-6 w-6" /> Financial Statements
            </CardTitle>
            <CardDescription>Select a month and year to view the financial statement.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <MonthYearPicker
                period={period}
                onPeriodChange={setPeriod}
            />
            <Button onClick={handlePeriodSearch}>View Statement</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedMinute} onOpenChange={(isOpen) => !isOpen && setSelectedMinute(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMinute?.title}</DialogTitle>
            <DialogDescription>{selectedMinute?.summary}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Meeting held on {selectedMinute?.date ? format(new Date(selectedMinute.date), 'PPP') : ''}.
            </p>
            <Button asChild className="mt-4">
              <a href={selectedMinute?.url} target="_blank" rel="noopener noreferrer">Download PDF</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedStatement} onOpenChange={(isOpen) => !isOpen && setSelectedStatement(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedStatement?.title}</DialogTitle>
            <DialogDescription>{selectedStatement?.summary}</DialogDescription>
          </DialogHeader>
          <div className="py-4 relative aspect-[8/11] w-full">
            {selectedStatement?.url && (
                <Image 
                    src={selectedStatement.url} 
                    alt={selectedStatement.title} 
                    fill
                    className="object-contain"
                    data-ai-hint="financial document"
                />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
