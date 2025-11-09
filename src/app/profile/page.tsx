
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { PageLoader } from '@/components/page-loader';

export default function ProfileRedirectPage() {
    const { user, isUserLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading) {
            if (user) {
                router.replace(`/users/${user.uid}`);
            } else {
                router.replace('/login');
            }
        }
    }, [user, isUserLoading, router]);

    return <PageLoader />;
}
