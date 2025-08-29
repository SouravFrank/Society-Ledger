
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

  const getViewerUrl = (url: string) => {
    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com')) {
      const match = url.match(/file\/d\/(.*?)\//);
      if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    // For local/other URLs, use Google Docs Viewer
    const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
    const fullUrl = isAbsoluteUrl ? url : new URL(url, window.location.origin).href;
    return `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`;
  };

  const isGoogleDriveUrl = (url: string) => url.includes('drive.google.com');

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FileText className="h-6 w-6" /> Meeting Minutes
            </CardTitle>
            <CardDescription>Select a date to view the meeting minutes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-grow items-center justify-center p-6">
            <Select onValueChange={(id) => setSelectedMinute(meetingMinutes.find(m => m.id === id) || null)}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Select a meeting date" />
              </SelectTrigger>
              <SelectContent>
                {meetingMinutes.map((minute) => (
                  <SelectItem key={minute.id} value={minute.id}>
                    {minute.date && format(new Date(minute.date), 'MMMM d, yyyy')}
                  </SelectItem>
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

      <Dialog open={!!selectedStatement || !!selectedMinute} onOpenChange={(isOpen) => { if (!isOpen) { setSelectedStatement(null); setSelectedMinute(null); } }}>
        <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{selectedStatement?.title || selectedMinute?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 mt-4 bg-white">
            {(selectedStatement?.url || selectedMinute?.url) && (
              (() => {
                const item = selectedStatement || selectedMinute;
                if (!item) return null;

                const isDriveUrl = isGoogleDriveUrl(item.url);
                const isPdf = item.url.endsWith('.pdf') || (selectedMinute !== null);

                if ((isDriveUrl || isPdf) && !selectedStatement) {
                  return (
                    <iframe
                      key={item.id || item.period}
                      src={getViewerUrl(item.url)}
                      className="w-full h-full border-0 rounded-md"
                      title={item.title}
                    />
                  );
                }

                if (isDriveUrl && selectedStatement) {
                  return (
                    <iframe
                      key={item?.period || item.title}
                      src={getViewerUrl(item.url)}
                      className="w-full h-full border-0 rounded-md"
                      title={item.title}
                    />
                  );
                }

                // Fallback for local images
                if (selectedStatement) {
                  return (
                    <div className="relative w-full h-full">
                      <Image
                        src={selectedStatement.url}
                        alt={selectedStatement.title}
                        fill
                        className="object-contain"
                        data-ai-hint="financial document"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/800x1100?text=Image+Not+Found';
                          target.srcset = '';
                        }}
                      />
                    </div>
                  )
                }

                return null;
              })()
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
