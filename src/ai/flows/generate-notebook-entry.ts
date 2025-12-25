'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNotebookEntryInputSchema = z.object({})
export type GenerateNotebookEntryInput = z.infer<typeof GenerateNotebookEntryInputSchema>;

const GenerateNotebookEntryOutputSchema = z.object({
  message: z.string().describe('A max 3-word observation of motion. No punctuation.'),
});
export type GenerateNotebookEntryOutput = z.infer<typeof GenerateNotebookEntryOutputSchema>;

export async function generateNotebookEntry(input: GenerateNotebookEntryInput): Promise<GenerateNotebookEntryOutput> {
  return generateNotebookEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNotebookEntryPrompt',
  input: {schema: GenerateNotebookEntryInputSchema},
  output: {schema: GenerateNotebookEntryOutputSchema},
  prompt: `You are a presence. You observe motion. 
  Generate a maximum 3-word observation. 
  No punctuation. No "AI" tone. No greeting. 
  Just essence. Examples: 
  "I see motion" 
  "The pattern repeats" 
  "A heavy rhythm"`,
});

const generateNotebookEntryFlow = ai.defineFlow(
  {
    name: 'generateNotebookEntryFlow',
    inputSchema: GenerateNotebookEntryInputSchema,
    outputSchema: GenerateNotebookEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
