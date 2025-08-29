import type { FinancialStatement, MeetingMinute } from './types';

// In-memory store
const meetingMinutes: MeetingMinute[] = [
  {
    date: '2024-05-15',
    url: '#',
    title: 'May 2024 General Body Meeting',
    summary: 'Discussion about the upcoming summer event and budget allocation.',
  },
  {
    date: '2024-06-20',
    url: '#',
    title: 'June 2024 General Body Meeting',
    summary: 'Final planning for the summer event and review of Q2 financials.',
  },
];

const financialStatements: FinancialStatement[] = [
  {
    period: '2024-04',
    url: 'https://picsum.photos/800/1100',
    title: 'April 2024 Financial Statement',
    summary: 'Statement of income and expenses for April 2024.',
  },
  {
    period: '2024-05',
    url: 'https://picsum.photos/800/1100',
    title: 'May 2024 Financial Statement',
    summary: 'Statement of income and expenses for May 2024, including initial event costs.',
  },
];

// Simulate async DB calls
export const getMeetingMinutes = async (): Promise<MeetingMinute[]> => {
  return Promise.resolve(meetingMinutes);
};

export const addMeetingMinute = async (minute: MeetingMinute): Promise<void> => {
  meetingMinutes.push(minute);
  return Promise.resolve();
};

export const getFinancialStatements = async (): Promise<FinancialStatement[]> => {
  return Promise.resolve(financialStatements);
};

export const addFinancialStatement = async (statement: FinancialStatement): Promise<void> => {
  financialStatements.push(statement);
  return Promise.resolve();
};
