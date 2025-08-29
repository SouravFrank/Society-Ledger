import type { FinancialStatement, MeetingMinute } from './types';
import { financialStatements, meetingMinutes } from '@/data';

// Simulate async DB calls
export const getMeetingMinutes = async (): Promise<MeetingMinute[]> => {
  const sortedMinutes = [...meetingMinutes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Promise.resolve(sortedMinutes);
};

export const addMeetingMinute = async (minute: Omit<MeetingMinute, 'id'>): Promise<void> => {
  const newMinute: MeetingMinute = {
    ...minute,
    id: `${minute.date}-${Math.random()}`,
  };
  meetingMinutes.unshift(newMinute);
  return Promise.resolve();
};

export const getFinancialStatements = async (): Promise<FinancialStatement[]> => {
  const sortedStatements = [...financialStatements].sort((a,b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime());
  return Promise.resolve(sortedStatements);
};

export const addFinancialStatement = async (statement: FinancialStatement): Promise<void> => {
  financialStatements.unshift(statement);
  return Promise.resolve();
};
