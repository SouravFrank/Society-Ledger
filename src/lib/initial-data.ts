import type { FinancialStatement, MeetingMinute } from './types';

export const getInitialMeetingMinutes = (): MeetingMinute[] => [
  {
    date: '2024-08-21',
    url: '/resources/moms/MOM_21_08.pdf',
    title: 'August 21 2024 General Body Meeting',
  },
  {
    date: '2024-08-28',
    url: '/resources/moms/MOM_28_08.pdf',
    title: 'August 28 2024 General Body Meeting',
  },
  {
    date: '2024-11-24',
    url: '/resources/moms/MOM_24_11.pdf',
    title: 'November 24 2024 General Body Meeting'
  }
];

export const getInitialFinancialStatements = (): FinancialStatement[] => [
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
