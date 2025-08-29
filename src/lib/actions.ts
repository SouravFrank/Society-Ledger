import { z } from 'zod';

import { addFinancialStatement, addMeetingMinute } from './db';
import { MeetingMinute } from './types';
import { editorCredentials } from '@/data/credentials';

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(1),
});

export async function loginAction(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { error: 'Invalid username or password.' };
  }
  
  if (parsed.data.username === editorCredentials.username && parsed.data.password === editorCredentials.password) {
    return { success: true };
  } else {
    return { error: 'Invalid username or password.' };
  }
}

export async function logoutAction() {
  return { success: true };
}

const minuteSchema = z.object({
  date: z.string(),
  title: z.string(),
  url: z.string().url({ message: 'Please enter a valid Google Drive URL.' }),
});

export async function addMeetingMinuteAction(formData: FormData) {
    const parsed = minuteSchema.safeParse({
      date: formData.get('date'),
      title: formData.get('title'),
      url: formData.get('url'),
    });
    
    if (!parsed.success) {
        return { error: parsed.error.errors[0].message || 'Invalid data provided for meeting minute.'};
    }

    const { date, title, url } = parsed.data;
    
    const newMinute: Omit<MeetingMinute, 'id'> = {
        date,
        title,
        url,
    };
    await addMeetingMinute(newMinute);

    return { success: true };
}

const statementSchema = z.object({
  period: z.string(),
  title: z.string(),
  url: z.string().url({ message: 'Please enter a valid Google Drive URL.' }),
});

export async function addFinancialStatementAction(formData: FormData) {
    const parsed = statementSchema.safeParse({
        period: formData.get('period'),
        title: formData.get('title'),
        url: formData.get('url'),
    });

    if (!parsed.success) {
        return { error: parsed.error.errors[0].message || 'Invalid data provided for financial statement.'};
    }
    
    const { period, title, url } = parsed.data;

    await addFinancialStatement({ 
        period, 
        title, 
        url,
    });

    return { success: true };
}
