'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { FinancialStatement, MeetingMinute } from '@/lib/types';
import { groupBy } from 'lodash';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { FileText, ImageIcon } from 'lucide-react';

interface PublicDashboardProps {
  meetingMinutes: MeetingMinute[];
  financialStatements: FinancialStatement[];
}

export default function PublicDashboard({
  meetingMinutes,
  financialStatements,
}: PublicDashboardProps) {
  const [selectedStatement, setSelectedStatement] = useState<FinancialStatement | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<MeetingMinute | null>(null);

  // Group meeting minutes by year in descending order
  const groupedMeetingMinutes = Object.entries(
    groupBy(meetingMinutes, (minute) => new Date(minute.date).getFullYear())
  ).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));

  // Group financial statements by year in descending order
  const groupedFinancialStatements = Object.entries(
    groupBy(financialStatements, (statement) => new Date(statement.period + '-01').getFullYear())
  ).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA));

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
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Dialog open={!!selectedStatement || !!selectedMinute} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedStatement(null);
          setSelectedMinute(null);
        }
      }}>
        {!selectedStatement && !selectedMinute && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <FileText className="h-6 w-6" /> Meeting Minutes
                </CardTitle>
                <CardDescription>Select a date to view the meeting minutes.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow items-center justify-center p-6">
                <Select onValueChange={(date) => setSelectedMinute(meetingMinutes.find(m => m.date === date) || null)}>
                  <SelectTrigger className="w-full max-w-sm">
                    <SelectValue placeholder="Select a meeting date" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupedMeetingMinutes.map(([year, minutes]) => (
                      <div key={year}>
                        <div className="px-2 py-1 font-bold text-gray-700">{year}</div>
                        {(minutes as MeetingMinute[]).map((minute) => (
                          <SelectItem key={minute.date} value={minute.date}>
                            {format(new Date(minute.date), 'MMMM dd, yyyy')}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <ImageIcon className="h-6 w-6" /> Financial Statements
                </CardTitle>
                <CardDescription>Select a period to view the financial statement.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow items-center justify-center p-6">
                <Select onValueChange={(period) => setSelectedStatement(financialStatements.find(s => s.period === period) || null)}>
                  <SelectTrigger className="w-full max-w-sm">
                    <SelectValue placeholder="Select a statement period" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupedFinancialStatements.map(([year, statements]) => (
                      <div key={year}>
                        <div className="px-2 py-1 font-bold text-gray-700">{year}</div>
                        {(statements as FinancialStatement[]).map((statement) => (
                          <SelectItem key={statement.period} value={statement.period}>
                            {format(new Date(statement.period + '-01'), 'MMMM yyyy')}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        )}

        {(selectedStatement?.url || selectedMinute?.url) && (
          <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>
                {selectedStatement
                  ? format(new Date(selectedStatement.period + '-01'), 'MMMM yyyy')
                  : selectedMinute
                  ? format(new Date(selectedMinute.date), 'MMMM dd, yyyy')
                  : 'No Date Available'}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 mt-4 bg-white">
              <iframe
                key={selectedStatement ? `statement-${selectedStatement.period}` : `minute-${selectedMinute?.date}`}
                src={getViewerUrl(selectedStatement?.url || selectedMinute?.url || '')}
                className="w-full h-full border-0 rounded-md"
                title={selectedStatement?.formattedDate || selectedMinute?.formattedDate || 'No Date Available'}
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
