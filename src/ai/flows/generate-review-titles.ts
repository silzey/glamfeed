'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating review titles from user inputs.
 *
 * It includes:
 * - generateReviewTitle - A function that generates a review title based on the review content.
 * - GenerateReviewTitleInput - The input type for the generateReviewTitle function.
 * - GenerateReviewTitleOutput - The return type for the generateReviewTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReviewTitleInputSchema = z.object({
  reviewText: z
    .string()
    .describe('The text content of the review for which a title is to be generated.'),
});
export type GenerateReviewTitleInput = z.infer<typeof GenerateReviewTitleInputSchema>;

const GenerateReviewTitleOutputSchema = z.object({
  title: z
    .string()
    .describe('A concise and descriptive title generated from the review content.'),
});
export type GenerateReviewTitleOutput = z.infer<typeof GenerateReviewTitleOutputSchema>;

export async function generateReviewTitle(input: GenerateReviewTitleInput): Promise<GenerateReviewTitleOutput> {
  return generateReviewTitleFlow(input);
}

const reviewTitlePrompt = ai.definePrompt({
  name: 'reviewTitlePrompt',
  input: {schema: GenerateReviewTitleInputSchema},
  output: {schema: GenerateReviewTitleOutputSchema},
  prompt: `You are an AI assistant designed to generate concise and descriptive titles for cosmetic product reviews.

  Given the following review text, create a title that accurately reflects the content and main points of the review.
  The title should be engaging and help users quickly understand what the review is about.  Do not use clickbait titles, they should be factual.

  Review Text: {{{reviewText}}}
  `,
});

const generateReviewTitleFlow = ai.defineFlow(
  {
    name: 'generateReviewTitleFlow',
    inputSchema: GenerateReviewTitleInputSchema,
    outputSchema: GenerateReviewTitleOutputSchema,
  },
  async input => {
    const {output} = await reviewTitlePrompt(input);
    return output!;
  }
);
