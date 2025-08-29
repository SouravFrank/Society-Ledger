import type { FinancialStatement, MeetingMinute } from './types';
import fs from 'fs/promises';
import path from 'path';

const resourcesDir = path.join(process.cwd(), 'src', 'resources');

const getMockMeetingMinutes = (): MeetingMinute[] => [
    {
      date: '2024-08-21',
      url: '/resources/meeting-minute-2024-08-21.pdf',
      title: 'August 21 2024 General Body Meeting',
      summary: 'Discussion about the upcoming fall event and budget allocation.',
    },
    {
      date: '2024-08-28',
      url: '/resources/meeting-minute-2024-08-28.pdf',
      title: 'August 28 2024 General Body Meeting',
      summary: 'Final planning for the fall event and review of Q3 financials.',
    },
];

const getMockFinancialStatements = (): FinancialStatement[] => [
    {
      period: '2024-07',
      url: '/resources/financial-statement-2024-07.png',
      title: 'July 2024 Financial Statement',
      summary: 'Statement of income and expenses for July 2024.',
    },
    {
      period: '2024-08',
      url: '/resources/financial-statement-2024-08.png',
      title: 'August 2024 Financial Statement',
      summary: 'Statement of income and expenses for August 2024, including initial event costs.',
    },
];


let meetingMinutes: MeetingMinute[] = getMockMeetingMinutes();
let financialStatements: FinancialStatement[] = getMockFinancialStatements();

const dataFilePath = path.join(resourcesDir, 'data.json');

async function loadData() {
    try {
        await fs.access(resourcesDir);
    } catch {
        await fs.mkdir(resourcesDir, { recursive: true });
    }

    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        if (jsonData.meetingMinutes && jsonData.financialStatements) {
            meetingMinutes = jsonData.meetingMinutes;
            financialStatements = jsonData.financialStatements;
        } else {
            await saveData();
        }
    } catch (error) {
        // data.json doesn't exist, so we'll create it with mock data.
        await saveData();
    }
}

async function saveData() {
  await fs.writeFile(dataFilePath, JSON.stringify({ meetingMinutes, financialStatements }, null, 2), 'utf-8');
}

loadData();


// Simulate async DB calls
export const getMeetingMinutes = async (): Promise<MeetingMinute[]> => {
  await loadData();
  return Promise.resolve(meetingMinutes);
};

export const addMeetingMinute = async (minute: MeetingMinute): Promise<void> => {
  await loadData();
  meetingMinutes.push(minute);
  await saveData();
  return Promise.resolve();
};

export const getFinancialStatements = async (): Promise<FinancialStatement[]> => {
  await loadData();
  return Promise.resolve(financialStatements);
};

export const addFinancialStatement = async (statement: FinancialStatement): Promise<void> => {
  await loadData();
  financialStatements.push(statement);
  await saveData();
  return Promise.resolve();
};
