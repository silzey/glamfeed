import { Gem } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="GlamFeed Home">
      <Gem className="h-6 w-6 text-primary" />
      <h1 className="font-headline text-2xl font-bold text-foreground">
        GlamFeed
      </h1>
    </Link>
  );
}
