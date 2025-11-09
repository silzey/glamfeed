
'use client';

import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin-fast text-primary" strokeWidth={1.5} />
      </div>
    </div>
  );
}
