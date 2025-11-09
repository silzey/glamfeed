
'use client';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Award, ArrowLeft, MessageSquarePlus, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Review, AppUser, Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, orderBy, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const ReviewList = lazy(() => import('@/components/review-list'));

const getLevel = (coins: number) => {
    if (coins >= 15000) return { name: 'Platinum', color: 'bg-purple-500' };
    if (coins >= 5000) return { name: 'Gold', color: 'bg-amber-500' };
    if (coins >= 1000) return { name: 'Silver', color: 'bg-slate-400' };
    return { name: 'Bronze', color: 'bg-orange-600' };
}

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user: authUser, isUserLoading: isAuthLoading } = useAuth();
    const userId = params.id as string;
    const firestore = useFirestore();
    
    const userDocRef = useMemoFirebase(() => (firestore && userId ? doc(firestore, 'users', userId) : null), [firestore, userId]);
    const { data: user, isLoading: isUserLoading } = useDoc<AppUser>(userDocRef);

    const reviewsQuery = useMemoFirebase(() => {
        if (!firestore || !userId) return null;
        // This query assumes posts are in a top-level 'feed' collection and have a 'userId' field.
        return query(collection(firestore, 'feed'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    }, [firestore, userId]);

    const { data: reviews, isLoading: isLoadingReviews } = useCollection<Post>(reviewsQuery);
    
    const [isFollowing, setIsFollowing] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    
    const userLevel = user && typeof user.coins === 'number' ? getLevel(user.coins) : getLevel(0);

    const followRef = useMemoFirebase(() => {
        if (!firestore || !authUser || !userId) return null;
        return doc(firestore, 'users', authUser.uid, 'following', userId);
    }, [firestore, authUser, userId]);
    
    const followerRef = useMemoFirebase(() => {
        if (!firestore || !authUser || !userId) return null;
        return doc(firestore, 'users', userId, 'followers', authUser.uid);
    }, [firestore, authUser, userId]);


    useEffect(() => {
        if (!followRef || !authUser) return;
        const checkFollowing = async () => {
            const followDoc = await getDoc(followRef);
            setIsFollowing(followDoc.exists());
        };
        checkFollowing();
    }, [followRef, authUser]);

    const handleFollowToggle = async () => {
        if (!followRef || !followerRef || !authUser) return;
        
        if (isFollowing) {
            await deleteDoc(followRef);
            await deleteDoc(followerRef);
        } else {
            await setDoc(followRef, { followedAt: new Date() });
            await setDoc(followerRef, { followedAt: new Date() });
        }
        setIsFollowing(!isFollowing);
    };

    const handleMessage = () => {
        setIsNavigating(true);
        router.push(`/messages/${userId}`);
    };
    
    const isOwnProfile = authUser?.uid === userId;

    if (isUserLoading || isAuthLoading || isLoadingReviews) {
        return null;
    }
    
    if (!user) {
        return (
          <div className="flex min-h-screen w-full flex-col bg-black text-white">
            <Header />
            <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
              <h1 className="text-2xl font-bold">User not found</h1>
              <Button variant="link" onClick={() => router.push('/')} className="mt-4 text-primary">
                Back to Feed
              </Button>
            </main>
          </div>
        );
    }

  return (
    <>
    {isNavigating && null}
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="glass-card p-4 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/50">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                        {userLevel && <Badge className={`${userLevel.color} border-0`}>
                            <Award className="mr-1 h-3 w-3"/>
                            {userLevel.name}
                        </Badge>}
                    </div>
                    <p className="text-white/70 mt-1 text-sm">@{user.username}</p>
                    <p className="text-white/90 mt-3 max-w-lg text-sm sm:text-base">
                        Just a beauty enthusiast sharing my honest thoughts on the latest products. ✨
                    </p>
                    <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 mt-4">
                        <div>
                            <p className="font-bold text-base sm:text-lg">{reviews?.length || 0}</p>
                            <p className="text-xs sm:text-sm text-white/60">Posts</p>
                        </div>
                         <div>
                            <p className="font-bold text-base sm:text-lg">0</p>
                            <p className="text-xs sm:text-sm text-white/60">Followers</p>
                        </div>
                         <div>
                            <p className="font-bold text-base sm:text-lg">0</p>
                            <p className="text-xs sm:text-sm text-white/60">Following</p>
                        </div>
                         {typeof user.coins === 'number' && (
                            <div>
                                <p className="font-bold text-base sm:text-lg">{user.coins.toLocaleString()}</p>
                                <p className="text-xs sm:text-sm text-white/60">Coins</p>
                            </div>
                        )}
                    </div>
                </div>
                 {!isOwnProfile && authUser && (
                     <div className="flex gap-2 self-center sm:self-start mt-4 sm:mt-0">
                        <Button onClick={handleFollowToggle} className={isFollowing ? 'glass-button' : 'bg-primary text-primary-foreground hover:bg-primary/90'}>
                            {isFollowing ? <UserCheck className="mr-2 h-4 w-4"/> : <UserPlus className="mr-2 h-4 w-4"/>}
                            {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                         <Button onClick={handleMessage} variant="outline" className="bg-white/10 hover:bg-white/20">
                            <MessageSquarePlus className="mr-2 h-4 w-4"/>
                            Message
                        </Button>
                    </div>
                 )}
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-bold mb-4">{isOwnProfile ? "Your" : `${user.name}'s`} Posts</h2>
            <Suspense fallback={null}>
                {reviews && reviews.length > 0 ? (
                    <ReviewList
                        posts={reviews}
                    />
                ) : (
                    <div className="text-center py-20 glass-card">
                        <p className="text-lg text-white/70">{isOwnProfile ? "You haven't" : `${user.name} hasn't`} posted any reviews yet.</p>
                    </div>
                )}
            </Suspense>
        </div>
      </main>
    </div>
    </>
  );
}
