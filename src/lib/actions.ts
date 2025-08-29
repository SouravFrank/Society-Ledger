'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
    cookies().set('auth_token', 'editor-secret-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
  } else {
    return { error: 'Invalid username or password.' };
  }

  redirect('/shibalik-b/editor');
}

export async function logoutAction() {
  cookies().delete('auth_token');
  redirect('/shibalik-b/login');
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

    revalidatePath('/shibalik-b/editor');
    revalidatePath('/');
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

    revalidatePath('/shibalik-b/editor');
    revalidatePath('/');
    return { success: true };
}
