import type { FinancialStatement, MeetingMinute } from './types';
import fs from 'fs/promises';
import path from 'path';
import { getInitialMeetingMinutes, getInitialFinancialStatements } from './initial-data';

const dataDir = path.join(process.cwd(), 'src', 'data');
const dataFilePath = path.join(dataDir, 'data.json');

let meetingMinutes: MeetingMinute[] = [];
let financialStatements: FinancialStatement[] = [];

async function loadData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    meetingMinutes = jsonData.meetingMinutes || getInitialMeetingMinutes();
    financialStatements = jsonData.financialStatements || getInitialFinancialStatements();
  } catch (error) {
    // If data.json doesn't exist or is invalid, use initial data
    meetingMinutes = getInitialMeetingMinutes();
    financialStatements = getInitialFinancialStatements();
    await saveData();
  }
}

async function saveData() {
    try {
        await fs.mkdir(dataDir, { recursive: true });
        const dataToSave = {
            meetingMinutes,
            financialStatements
        };
        await fs.writeFile(dataFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (error) {
        console.error("Failed to save data", error);
    }
}

// Initial load
loadData();

// Simulate async DB calls
export const getMeetingMinutes = async (): Promise<MeetingMinute[]> => {
  await loadData();
  return Promise.resolve([...meetingMinutes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

export const addMeetingMinute = async (minute: Omit<MeetingMinute, 'id'>): Promise<void> => {
  await loadData();
  const newMinute = { ...minute, id: `${minute.date}-${minute.title}` };
  meetingMinutes.push(newMinute);
  await saveData();
  return Promise.resolve();
};

export const getFinancialStatements = async (): Promise<FinancialStatement[]> => {
  await loadData();
  return Promise.resolve([...financialStatements].sort((a,b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime()));
};

export const addFinancialStatement = async (statement: FinancialStatement): Promise<void> => {
  await loadData();
  financialStatements.push(statement);
  await saveData();
  return Promise.resolve();
};
