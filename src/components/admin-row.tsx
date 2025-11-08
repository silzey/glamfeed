'use client';
import { ReactNode } from "react";

export default function AdminRow({ children, actions }: { children: ReactNode; actions?: ReactNode; }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2 last:border-b-0">
      <div className="flex-1 min-w-0 pr-4">{children}</div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
}
