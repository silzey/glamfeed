'use server';

import { summarizeReview } from '@/ai/flows/summarize-reviews';

export async function getReviewSummary(reviewText: string): Promise<string> {
  if (reviewText.length < 200) {
    return reviewText;
  }

  try {
    const result = await summarizeReview({ reviewText });
    return result.summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Could not generate a summary at this time.';
  }
}
