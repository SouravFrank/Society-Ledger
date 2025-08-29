import type { FinancialStatement, MeetingMinute } from '@/lib/types';

export const meetingMinutes: MeetingMinute[] = [
  {
    id: '2024-08-21',
    date: '2024-08-21',
    url: '/resources/moms/MOM_21_08_25.pdf',
    title: 'August 21 2024 Meeting',
  },
  {
    id: '2024-08-28',
    date: '2024-08-28',
    url: '/resources/moms/MOM_28_08_25.pdf',
    title: 'August 28 2024 Meeting',
  },
  {
    id: '2024-11-24',
    date: '2024-11-24',
    url: '/resources/moms/MOM_24_11_24.pdf',
    title: 'November 24 2024 Meeting'
  }
];

export const financialStatements: FinancialStatement[] = [
    {
    period: '2024-07',
    url: '/resources/monthlyStatements/07_25.jpeg',
    title: 'July 2024 Financial Statement'
  },
  {
    period: '2024-08',
    url: '/resources/monthlyStatements/financial-statement-2024-08.png',
    title: 'August 2024 Financial Statement'
  },
];
