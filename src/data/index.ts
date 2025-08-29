import type { FinancialStatement, MeetingMinute } from '@/lib/types';

import mom2108 from '@/resources/moms/MOM_21-08.pdf';
import mom2808 from '@/resources/moms/MOM_28-08.pdf';
import mom2411 from '@/resources/moms/MOM_24-11.pdf';

import fs202407 from '@/resources/monthlyStatements/financial-statement-2024-07.png';
import fs202408 from '@/resources/monthlyStatements/financial-statement-2024-08.png';

export const meetingMinutes: MeetingMinute[] = [
  {
    id: '2025-08-21-August-21-2024-Meeting',
    date: '2025-08-21',
    url: mom2108.src,
    title: 'August 21 2024 Meeting',
  },
  {
    id: '2025-08-28-August-28-2024-Meeting',
    date: '2025-08-28',
    url: mom2808.src,
    title: 'August 28 2024 Meeting',
  },
  {
    id: '2024-11-24-November-24-2024-Meeting',
    date: '2024-11-24',
    url: mom2411.src,
    title: 'November 24 2024 Meeting'
  }
];

export const financialStatements: FinancialStatement[] = [
    {
    period: '2024-07',
    url: fs202407.src,
    title: 'July 2024 Financial Statement',
    summary: 'Statement of income and expenses for July 2024.'
  },
  {
    period: '2024-08',
    url: fs202408.src,
    title: 'August 2024 Financial Statement',
    summary: 'Statement of income and expenses for August 2024, including initial event costs.'
  },
];
