'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

import { generateDocumentDescription } from '@/ai/flows/generate-document-description';
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
  file: fileSchema,
});

export async function addMeetingMinuteAction(formData: FormData) {
    const parsed = minuteSchema.safeParse({
      date: formData.get('date'),
      title: formData.get('title'),
      file: formData.get('file'),
    });
    
    if (!parsed.success) {
        return { error: 'Invalid data provided for meeting minute.'};
    }

    const { date, title, file } = parsed.data;
    
    const publicDir = path.join(process.cwd(), 'public', 'resources', 'moms');
    await fs.mkdir(publicDir, { recursive: true });
    
    const fileName = `MOM_${date.substring(5).replace('-', '_')}.${file.name.split('.').pop()}`;
    const filePath = path.join(publicDir, fileName);
    
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const newMinute: Omit<MeetingMinute, 'id'> = {
        date,
        title,
        url: `/resources/moms/${fileName}`,
    };
    await addMeetingMinute(newMinute);

    revalidatePath('/shibalik-b/editor');
    revalidatePath('/');
    return { success: true };
}

const statementSchema = z.object({
  period: z.string(),
  title: z.string(),
  file: fileSchema,
});

export async function addFinancialStatementAction(formData: FormData) {
    const parsed = statementSchema.safeParse({
        period: formData.get('period'),
        title: formData.get('title'),
        file: formData.get('file'),
    });

    if (!parsed.success) {
        return { error: 'Invalid data provided for financial statement.'};
    }
    
    const { period, title, file } = parsed.data;

    const publicDir = path.join(process.cwd(), 'public', 'resources', 'monthlyStatements');
    await fs.mkdir(publicDir, { recursive: true });

    const fileName = `financial-statement-${period}.${file.name.split('.').pop()}`;
    const filePath = path.join(publicDir, fileName);

    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    await addFinancialStatement({ 
        period, 
        title, 
        url: `/resources/monthlyStatements/${fileName}` 
    });

    revalidatePath('/shibalik-b/editor');
    revalidatePath('/');
    return { success: true };
}
