import type { FinancialStatement, MeetingMinute } from './types';
import { financialStatements, meetingMinutes } from '@/data';

// Simulate async DB calls
export const getMeetingMinutes = async (): Promise<MeetingMinute[]> => {
  const sortedMinutes = [...meetingMinutes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Promise.resolve(sortedMinutes);
};

export const addMeetingMinute = async (minute: Omit<MeetingMinute, 'id'>): Promise<void> => {
  // This is a mock implementation. In a real app, you would add to a database.
  console.log('Adding meeting minute:', minute);
  const newMinute = { ...minute, id: `${minute.date}-${minute.title.replace(/\s/g, '-')}` };
  meetingMinutes.push(newMinute);
  return Promise.resolve();
};

export const getFinancialStatements = async (): Promise<FinancialStatement[]> => {
  const sortedStatements = [...financialStatements].sort((a,b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime());
  return Promise.resolve(sortedStatements);
};

export const addFinancialStatement = async (statement: FinancialStatement): Promise<void> => {
  // This is a mock implementation. In a real app, you would add to a database.
  console.log('Adding financial statement:', statement);
  financialStatements.push(statement);
  return Promise.resolve();
};
