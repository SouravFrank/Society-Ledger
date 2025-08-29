'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { generateDocumentDescription } from '@/ai/flows/generate-document-description';
import { addFinancialStatement, addMeetingMinute } from './db';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { error: 'Invalid email or password.' };
  }
  
  // Mock authentication: in a real app, you'd verify credentials against a database
  if (parsed.data.email === 'editor@example.com' && parsed.data.password === 'password') {
    cookies().set('auth_token', 'editor-secret-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
  } else {
    return { error: 'Invalid email or password.' };
  }

  redirect('/editor');
}

export async function logoutAction() {
  cookies().delete('auth_token');
  redirect('/');
}

export async function generateDescriptionAction(
  documentType: 'meetingMinutes' | 'financialStatement',
  documentContent: string,
) {
  try {
    const result = await generateDocumentDescription({ documentType, documentContent });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate description.' };
  }
}

const minuteSchema = z.object({
  date: z.string(),
  title: z.string(),
  summary: z.string(),
  url: z.string(),
});

export async function addMeetingMinuteAction(data: unknown) {
    const parsed = minuteSchema.safeParse(data);
    if (!parsed.success) {
        return { error: 'Invalid data provided for meeting minute.'};
    }
    await addMeetingMinute(parsed.data);
    revalidatePath('/editor');
    revalidatePath('/');
    return { success: true };
}

const statementSchema = z.object({
  period: z.string(),
  title: z.string(),
  summary: z.string(),
  url: z.string(),
});

export async function addFinancialStatementAction(data: unknown) {
    const parsed = statementSchema.safeParse(data);
    if (!parsed.success) {
        return { error: 'Invalid data provided for financial statement.'};
    }
    await addFinancialStatement(parsed.data);
    revalidatePath('/editor');
    revalidatePath('/');
    return { success: true };
}
