'use client';
import { useState } from 'react';
import { Header } from '@/components/header';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/page-loader';
import { useAuth } from '@/firebase';
import { NotificationFeed } from '@/components/notification-feed';

export default function NotificationsPage() {
  const router = useRouter();
  const { user: authUser, isUserLoading } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  if (isUserLoading) {
    return <PageLoader />;
  }

  return (
    <>
    {isNavigating && <PageLoader />}
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 pt-20 sm:pt-24 flex-1">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <Bell
            className="h-10 w-10 text-primary"
            style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Notifications</h1>
            <p className="text-md sm:text-lg text-white/70">
              Catch up on your latest account activity.
            </p>
          </div>
        </div>
        
        <NotificationFeed />

      </main>
    </div>
    </>
  );
}
