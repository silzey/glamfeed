
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Belleza&family=Open+Sans:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <Providers>
            <div className="flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex-1 pt-20 sm:pt-24">{children}</main>
            </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
