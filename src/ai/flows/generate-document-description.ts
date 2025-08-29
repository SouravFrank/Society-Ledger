'use server';

/**
 * @fileOverview A document description generation AI agent.
 *
 * - generateDocumentDescription - A function that generates a document description.
 * - GenerateDocumentDescriptionInput - The input type for the generateDocumentDescription function.
 * - GenerateDocumentDescriptionOutput - The return type for the generateDocumentDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentDescriptionInputSchema = z.object({
  documentType: z
    .enum(['meetingMinutes', 'financialStatement'])
    .describe('The type of document being described.'),
  documentContent: z
    .string()
    .describe('The content of the document to generate a description for.'),
});
export type GenerateDocumentDescriptionInput = z.infer<typeof GenerateDocumentDescriptionInputSchema>;

const GenerateDocumentDescriptionOutputSchema = z.object({
  title: z.string().describe('A concise title for the document.'),
  summary: z.string().optional().describe('A brief summary of the document content.'),
});
export type GenerateDocumentDescriptionOutput = z.infer<typeof GenerateDocumentDescriptionOutputSchema>;

export async function generateDocumentDescription(
  input: GenerateDocumentDescriptionInput
): Promise<GenerateDocumentDescriptionOutput> {
  return generateDocumentDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentDescriptionPrompt',
  input: {schema: GenerateDocumentDescriptionInputSchema},
  output: {schema: GenerateDocumentDescriptionOutputSchema},
  prompt: `You are an expert administrative assistant. Based on the document type and content, generate a title and optionally a summary.

For meeting minutes, only generate a title.
For financial statements, generate both a title and a summary.

Document Type: {{{documentType}}}
Document Content: {{{documentContent}}}

Title: 
{{#if (eq documentType "financialStatement")}}
Summary:
{{/if}}
`,
});

const generateDocumentDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDocumentDescriptionFlow',
    inputSchema: GenerateDocumentDescriptionInputSchema,
    outputSchema: GenerateDocumentDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
