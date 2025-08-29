import type { FinancialStatement, MeetingMinute } from '@/lib/types';

export const meetingMinutes: MeetingMinute[] = [
  {
    id: '2025-08-21-August-21-2024-Meeting',
    date: '2025-08-21',
    url: '/resources/moms/MOM_21-08.pdf',
    title: 'August 21 2024 Meeting',
  },
  {
    id: '2025-08-28-August-28-2024-Meeting',
    date: '2025-08-28',
    url: '/resources/moms/MOM_28-08.pdf',
    title: 'August 28 2024 Meeting',
  },
  {
    id: '2024-11-24-November-24-2024-Meeting',
    date: '2024-11-24',
    url: '/resources/moms/MOM_24-11.pdf',
    title: 'November 24 2024 Meeting'
  }
];

export const financialStatements: FinancialStatement[] = [
    {
    period: '2024-07',
    url: '/resources/monthlyStatements/financial-statement-2024-07.png',
    title: 'July 2024 Financial Statement',
    summary: 'Statement of income and expenses for July 2024.'
  },
  {
    period: '2024-08',
    url: '/resources/monthlyStatements/financial-statement-2024-08.png',
    title: 'August 2024 Financial Statement',
    summary: 'Statement of income and expenses for August 2024, including initial event costs.'
  },
];
