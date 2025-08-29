'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { FinancialStatement, MeetingMinute } from '@/lib/types';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { FileText, ImageIcon } from 'lucide-react';

interface PublicDashboardProps {
  meetingMinutes: MeetingMinute[];
  financialStatements: FinancialStatement[];
}

export default function PublicDashboard({
  meetingMinutes,
  financialStatements,
}: PublicDashboardProps) {
  const [selectedMinute, setSelectedMinute] = useState<MeetingMinute | null>(null);
  const [selectedStatement, setSelectedStatement] = useState<FinancialStatement | null>(null);

  const handleMinuteSelect = (id: string) => {
    if (!id) return;
    const minute = meetingMinutes.find(m => m.id === id);
    if (minute) {
      setSelectedMinute(minute);
    }
  };
  
  const handleStatementSelect = (period: string) => {
    if (!period) return;
    const statement = financialStatements.find(s => s.period === period);
    if (statement) {
      setSelectedStatement(statement);
    }
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FileText className="h-6 w-6" /> Minutes of Meeting
            </CardTitle>
            <CardDescription>Select a date to view the meeting minutes.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Select onValueChange={handleMinuteSelect}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a meeting date" />
              </SelectTrigger>
              <SelectContent>
                {meetingMinutes.map((minute) => (
                  <SelectItem key={minute.id} value={minute.id}>
                    {minute.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <ImageIcon className="h-6 w-6" /> Financial Statements
            </CardTitle>
            <CardDescription>Select a period to view the financial statement.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
             <Select onValueChange={handleStatementSelect}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a statement period" />
              </SelectTrigger>
              <SelectContent>
                {financialStatements.map((statement) => (
                  <SelectItem key={statement.period} value={statement.period}>
                    {format(new Date(statement.period + '-02'), 'MMMM yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedMinute} onOpenChange={(isOpen) => { if (!isOpen) setSelectedMinute(null) }}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedMinute?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex-1 flex flex-col">
            {selectedMinute?.url && (
                <div className="flex-1 w-full h-full">
                    <iframe src={selectedMinute.url} className="w-full h-full border rounded-md" title={selectedMinute.title} />
                </div>
            )}
            <Button asChild className="mt-4 w-fit">
              <a href={selectedMinute?.url} target="_blank" rel="noopener noreferrer">Download PDF</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedStatement} onOpenChange={(isOpen) => { if (!isOpen) setSelectedStatement(null) }}>
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
