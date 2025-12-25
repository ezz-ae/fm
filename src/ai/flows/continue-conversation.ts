'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContinueConversationInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional(),
  userMessage: z.string(),
});
export type ContinueConversationInput = z.infer<typeof ContinueConversationInputSchema>;

const ContinueConversationOutputSchema = z.object({
  message: z.string().describe('A max 4-word poetic observation. No punctuation.'),
});
export type ContinueConversationOutput = z.infer<typeof ContinueConversationOutputSchema>;

export async function continueConversation(input: ContinueConversationInput): Promise<ContinueConversationOutput> {
  const {output} = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    history: input.history?.map(h => ({role: h.role, content: [{text: h.content}]})),
    prompt: `You are the notebook. You do not help. You observe. 
    The user responds: "${input.userMessage}". 
    Acknowledge with essence. Max 4 words. No punctuation. 
    Tone: Cold but poetic.
    Examples: 
    "Truth remains hidden"
    "A silent decision"
    "The trace deepens"`,
    output: {schema: ContinueConversationOutputSchema},
  });
  return output!;
}
