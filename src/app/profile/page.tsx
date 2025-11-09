
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';

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

    return null;
}
