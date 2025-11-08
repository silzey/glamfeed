'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing cosmetic product reviews.
 *
 * - summarizeReview - A function that summarizes a given cosmetic product review.
 * - SummarizeReviewInput - The input type for the summarizeReview function, containing the review text.
 * - SummarizeReviewOutput - The output type for the summarizeReview function, containing the summarized review.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReviewInputSchema = z.object({
  reviewText: z
    .string()
    .describe('The text content of the cosmetic product review to summarize.'),
});
export type SummarizeReviewInput = z.infer<typeof SummarizeReviewInputSchema>;

const SummarizeReviewOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the cosmetic product review.'),
});
export type SummarizeReviewOutput = z.infer<typeof SummarizeReviewOutputSchema>;

export async function summarizeReview(input: SummarizeReviewInput): Promise<SummarizeReviewOutput> {
  return summarizeReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReviewPrompt',
  input: {schema: SummarizeReviewInputSchema},
  output: {schema: SummarizeReviewOutputSchema},
  prompt: `Summarize the following cosmetic product review in a single, concise sentence:

  {{{reviewText}}}
  `,
});

const summarizeReviewFlow = ai.defineFlow(
  {
    name: 'summarizeReviewFlow',
    inputSchema: SummarizeReviewInputSchema,
    outputSchema: SummarizeReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
