import type { FinancialStatement, MeetingMinute } from './types';
import fs from 'fs/promises';
import path from 'path';

const resourcesDir = path.join(process.cwd(), 'src', 'resources');

const getInitialMeetingMinutes = (): MeetingMinute[] => [
  {
    date: '2024-08-21',
    url: '/resources/moms/meeting-minute-2024-08-21.pdf',
    title: 'August 21 2024 General Body Meeting',
    summary: 'Discussion about the upcoming fall event and budget allocation.'
  },
  {
    date: '2024-08-28',
    url: '/resources/moms/meeting-minute-2024-08-28.pdf',
    title: 'August 28 2024 General Body Meeting',
    summary: 'Final planning for the fall event and review of Q3 financials.'
  },
];

const getInitialFinancialStatements = (): FinancialStatement[] => [
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


let meetingMinutes: MeetingMinute[] = getInitialMeetingMinutes();
let financialStatements: FinancialStatement[] = getInitialFinancialStatements();

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
    // data.json doesn't exist, so we'll create it with initial data.
    await saveData();
  }
}

async function saveData() {
  const dataToSave = {
    meetingMinutes,
    financialStatements
  };
   try {
    await fs.access(dataFilePath);
    // If we can access it, we can write to it.
  } catch {
    // If it doesn't exist, create it with initial data.
    dataToSave.meetingMinutes = getInitialMeetingMinutes();
    dataToSave.financialStatements = getInitialFinancialStatements();
  }
  await fs.writeFile(dataFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
  meetingMinutes = dataToSave.meetingMinutes;
  financialStatements = dataToSave.financialStatements;
}

loadData();


// Simulate async DB calls
export const getMeetingMinutes = async (): Promise<MeetingMinute[]> => {
  await loadData();
  return Promise.resolve(meetingMinutes.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

export const addMeetingMinute = async (minute: MeetingMinute): Promise<void> => {
  await loadData();
  meetingMinutes.push(minute);
  await saveData();
  return Promise.resolve();
};

export const getFinancialStatements = async (): Promise<FinancialStatement[]> => {
  await loadData();
  return Promise.resolve(financialStatements.sort((a,b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime()));
};

export const addFinancialStatement = async (statement: FinancialStatement): Promise<void> => {
  await loadData();
  financialStatements.push(statement);
  await saveData();
  return Promise.resolve();
};
