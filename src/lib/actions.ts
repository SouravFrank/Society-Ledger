'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

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

const fileSchema = z.custom<File>(val => val instanceof File, "Please upload a file");

const minuteSchema = z.object({
  date: z.string(),
  title: z.string(),
  summary: z.string(),
  file: fileSchema,
});

export async function addMeetingMinuteAction(data: FormData) {
    const parsed = minuteSchema.safeParse({
      date: data.get('date'),
      title: data.get('title'),
      summary: data.get('summary'),
      file: data.get('file'),
    });
    
    if (!parsed.success) {
        return { error: 'Invalid data provided for meeting minute.'};
    }

    const { date, title, summary, file } = parsed.data;
    
    const resourcesDir = path.join(process.cwd(), 'src', 'resources');
    await fs.mkdir(resourcesDir, { recursive: true });
    
    const fileName = `meeting-minute-${date}.${file.name.split('.').pop()}`;
    const filePath = path.join(resourcesDir, fileName);
    const fileUrl = `/resources/${fileName}`;
    
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    await addMeetingMinute({ date, title, summary, url: fileUrl });
    revalidatePath('/editor');
    revalidatePath('/');
    return { success: true };
}

const statementSchema = z.object({
  period: z.string(),
  title: z.string(),
  summary: z.string(),
  file: fileSchema,
});

export async function addFinancialStatementAction(data: FormData) {
    const parsed = statementSchema.safeParse({
        period: data.get('period'),
        title: data.get('title'),
        summary: data.get('summary'),
        file: data.get('file'),
    });

    if (!parsed.success) {
        return { error: 'Invalid data provided for financial statement.'};
    }
    
    const { period, title, summary, file } = parsed.data;

    const resourcesDir = path.join(process.cwd(), 'src', 'resources');
    await fs.mkdir(resourcesDir, { recursive: true });

    const fileName = `financial-statement-${period}.${file.name.split('.').pop()}`;
    const filePath = path.join(resourcesDir, fileName);
    const fileUrl = `/resources/${fileName}`;

    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    await addFinancialStatement({ period, title, summary, url: fileUrl });
    revalidatePath('/editor');
    revalidatePath('/');
    return { success: true };
}
