import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'GlamFeed',
  description: 'Your daily feed of cosmetic reviews.',
};

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
          href="https://fonts.googleapis.com/css2?family=Belleza&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <FirebaseClientProvider>
          <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 pt-24">{children}</main>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
