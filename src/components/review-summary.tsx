'use client';

import { useState, useTransition } from 'react';
import { getReviewSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

type ReviewSummaryProps = {
  text: string;
};

const TRUNCATE_LENGTH = 150;

export function ReviewSummary({ text }: ReviewSummaryProps) {
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<'truncated' | 'expanded' | 'summary'>(
    text.length > TRUNCATE_LENGTH ? 'truncated' : 'expanded'
  );
  const [summaryText, setSummaryText] = useState<string | null>(null);

  const handleGenerateSummary = () => {
    if (summaryText) {
      setView('summary');
      return;
    }
    startTransition(async () => {
      const result = await getReviewSummary(text);
      setSummaryText(result);
      setView('summary');
    });
  };

  const renderContent = () => {
    switch (view) {
      case 'summary':
        return summaryText;
      case 'expanded':
        return text;
      case 'truncated':
        return `${text.substring(0, TRUNCATE_LENGTH)}...`;
    }
  };

  return (
    <div className="space-y-2 text-sm text-foreground/90">
      <p className="whitespace-pre-wrap">{renderContent()}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {view === 'truncated' && (
          <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground" onClick={() => setView('expanded')}>
            Show more
          </Button>
        )}
        {view === 'expanded' && text.length > TRUNCATE_LENGTH && (
          <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground" onClick={() => setView('truncated')}>
            Show less
          </Button>
        )}
        {view === 'summary' && (
           <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground" onClick={() => setView('expanded')}>
            Show original
          </Button>
        )}
        {text.length > TRUNCATE_LENGTH && view !== 'summary' && (
          <Button
            variant="link"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isPending}
            className="h-auto p-0 font-semibold text-primary"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1 h-4 w-4" />
            )}
            {isPending ? 'Summarizing...' : 'AI Summary'}
          </Button>
        )}
      </div>
    </div>
  );
}
