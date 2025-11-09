'use client';

import { useMemo } from 'react';
import { Header } from '@/components/header';
import { 
    BarChart, Users, Heart, MessageCircle, ArrowLeft, Share2, Eye, UserPlus, 
    TrendingUp, TrendingDown, Coins, HelpCircle, Star, ShoppingBag, Gift, Video, Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/firebase';
import { PageLoader } from '@/components/page-loader';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Review } from '@/lib/types';
import Link from 'next/link';
import { format } from 'date-fns';

const chartConfig = {
  likes: { label: 'Likes', color: 'hsl(var(--primary))' },
  comments: { label: 'Comments', color: 'hsl(var(--secondary))' },
  followers: { label: 'Followers', color: 'hsl(var(--primary))' },
  reviews: { label: 'Reviews', color: 'hsl(330, 80%, 60%)'},
  missions: { label: 'Missions', color: 'hsl(210, 80%, 60%)'},
  logins: { label: 'Logins', color: 'hsl(150, 80%, 60%)'}
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { user: authUser, isUserLoading } = useAuth();
  const firestore = useFirestore();

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return query(collection(firestore, 'feed'), where('userId', '==', authUser.uid));
  }, [firestore, authUser]);

  const { data: reviews, isLoading: isLoadingReviews } = useCollection<Review>(reviewsQuery);

  const engagementData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { month: format(d, 'MMM'), likes: 0, comments: 0 };
    }).reverse();

    if (!reviews) return months;

    reviews.forEach(review => {
      if (review.createdAt) {
        const reviewDate = review.createdAt.toDate();
        const monthStr = format(reviewDate, 'MMM');
        const monthData = months.find(m => m.month === monthStr);
        if (monthData) {
          monthData.likes += review.likeCount || 0;
          monthData.comments += review.commentCount || 0;
        }
      }
    });

    return months;
  }, [reviews]);

  const followerData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { date: d.toISOString(), followers: 0 };
    }).reverse();
  }, []);

  const coinEarningsData = useMemo(() => {
    if (!authUser?.coins) return [];
    return [
      { name: 'Reviews', value: authUser.coins * 0.6 || 0, fill: 'var(--color-reviews)' },
      { name: 'Missions', value: authUser.coins * 0.2 || 0, fill: 'var(--color-missions)' },
      { name: 'Likes', value: authUser.coins * 0.15 || 0, fill: 'var(--color-likes)' },
      { name: 'Logins', value: authUser.coins * 0.05 || 0, fill: 'var(--color-logins)' },
    ];
  }, [authUser?.coins]);


  const analytics = useMemo(() => {
    if (!reviews || !authUser) return null;

    const totalLikes = authUser.totalLikes || 0;
    const totalComments = authUser.totalComments || 0;
    const totalShares = authUser.totalShares || 0;

    const topPost = reviews.reduce((top, current) => {
      const topEngagement = (top?.likeCount || 0) + (top?.commentCount || 0);
      const currentEngagement = (current.likeCount || 0) + (current.commentCount || 0);
      return currentEngagement > topEngagement ? current : top;
    }, reviews[0]);
    
    // Using a mock follower count for engagement rate calculation as it's not implemented
    const followerCount = 1000;

    return {
      totalPosts: reviews.length,
      totalLikes,
      totalComments,
      totalShares,
      topPost,
      engagementRate: reviews.length > 0 ? (((totalLikes + totalComments) / reviews.length) / followerCount) * 100 : 0, 
    };
  }, [reviews, authUser]);


  if (isUserLoading || isLoadingReviews) {
    return <PageLoader />;
  }
  
  if (!authUser) {
    router.push('/login');
    return <PageLoader />;
  }

  const topPostImage = analytics?.topPost ? PlaceHolderImages.find(p => p.imageUrl === analytics.topPost.imageUrl) : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-6xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <BarChart
            className="h-10 w-10 text-primary"
            style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Creator Analytics</h1>
            <p className="text-md sm:text-lg text-white/70">
              Your content performance and audience insights.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-4">Key Metrics (Last 30 Days)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card border-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/80 flex justify-between items-center">Followers <Users className="h-4 w-4 text-white/60" /></CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-green-400">+0%</p>
                </CardContent>
            </Card>
            <Card className="glass-card border-0">
                <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium text-white/80 flex justify-between items-center">Profile Views <Eye className="h-4 w-4 text-white/60" /></CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-green-400">+0%</p>
                </CardContent>
            </Card>
            <Card className="glass-card border-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/80 flex justify-between items-center">Total Likes <Heart className="h-4 w-4 text-white/60" /></CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics?.totalLikes || 0}</div>
                    <p className="text-xs text-green-400">+0%</p>
                </CardContent>
            </Card>
            <Card className="glass-card border-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/80 flex justify-between items-center">Total Comments <MessageCircle className="h-4 w-4 text-white/60" /></CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics?.totalComments || 0}</div>
                    <p className="text-xs text-green-400">+0%</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="glass-card p-4 md:p-6 border-0">
                 <h2 className="text-xl font-semibold text-white mb-4">Engagement Overview</h2>
                <ChartContainer config={chartConfig} className="w-full h-[250px]">
                  <RechartsBarChart data={engagementData} accessibilityLayer>
                     <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)"/>
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                    <YAxis tickLine={false} axisLine={false} tickMargin={10} stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                     <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="likes" fill="var(--color-likes)" radius={4} />
                    <Bar dataKey="comments" fill="var(--color-comments)" radius={4} />
                  </RechartsBarChart>
                </ChartContainer>
            </Card>
            <Card className="glass-card p-4 md:p-6 border-0">
                 <h2 className="text-xl font-semibold text-white mb-4">Follower Growth</h2>
                <ChartContainer config={chartConfig} className="w-full h-[250px]">
                  <RechartsLineChart data={followerData}>
                     <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)"/>
                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleString('default', { month: 'short' })} tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                    <YAxis tickLine={false} axisLine={false} tickMargin={10} stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="followers" stroke="var(--color-followers)" strokeWidth={2} dot={{r: 4, fill: "var(--color-followers)"}} />
                  </RechartsLineChart>
                </ChartContainer>
            </Card>
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-4 mt-8">Content &amp; Coin Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card border-0 md:col-span-1 lg:col-span-1">
                <CardHeader>
                    <CardTitle>Top Performing Post</CardTitle>
                    <CardDescription>Based on total engagement</CardDescription>
                </CardHeader>
                <CardContent>
                    {analytics?.topPost ? (
                        <Link href={`/reviews/${analytics.topPost.id}`}>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted group">
                                <Image 
                                    src={topPostImage?.imageUrl || analytics.topPost.imageUrl!}
                                    alt={analytics.topPost.text}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                    data-ai-hint={topPostImage?.imageHint || 'cosmetics'}
                                />
                            </div>
                            <h3 className="font-semibold mt-4 group-hover:underline">{analytics.topPost.text}</h3>
                            <div className="flex items-center gap-4 text-sm text-white/80 mt-1">
                                <span className="flex items-center gap-1"><Heart className="h-4 w-4"/> {analytics.topPost.likeCount || 0}</span>
                                <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4"/> {analytics.topPost.commentCount || 0}</span>
                            </div>
                        </Link>
                    ) : (
                        <>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground text-sm">No posts yet</p>
                            </div>
                            <h3 className="font-semibold mt-4">Nothing to see here</h3>
                             <div className="flex items-center gap-4 text-sm text-white/80 mt-1">
                                <span className="flex items-center gap-1"><Heart className="h-4 w-4"/> 0</span>
                                <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4"/> 0</span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card className="glass-card border-0 md:col-span-1 lg:col-span-1">
                 <CardHeader>
                    <CardTitle>Coin Earnings Breakdown</CardTitle>
                    <CardDescription>All-time earnings by source</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="w-full h-[200px]">
                        <RechartsPieChart>
                            <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={coinEarningsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                 {coinEarningsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                             <ChartLegend content={<ChartLegendContent />} />
                        </RechartsPieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-1">
                <Card className="glass-card border-0">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2"><TrendingUp/> Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl font-bold">{analytics?.engagementRate.toFixed(2) || '0'}%</div>
                        <p className="text-xs text-white/60">+0%</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-0">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2"><Share2/> Total Shares</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl font-bold">{analytics?.totalShares || 0}</div>
                        <p className="text-xs text-white/60">All time</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-0">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2"><Coins/> Coins Earned</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl font-bold">{authUser.coins?.toLocaleString() || 0}</div>
                         <p className="text-xs text-white/60">All time</p>
                    </CardContent>
                </Card>
                 <Card className="glass-card border-0">
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2"><ShoppingBag/> Coins Spent</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl font-bold">0</div>
                         <p className="text-xs text-white/60">All time</p>
                    </CardContent>
                </Card>
                 <Card className="glass-card border-0 col-span-2">
                     <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2"><Wallet/> Wallet Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl font-bold">{authUser.coins?.toLocaleString() || 0} Coins</div>
                         <p className="text-xs text-white/60">≈ ${((authUser.coins || 0) / 1000).toFixed(2)} USD</p>
                    </CardContent>
                </Card>
            </div>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-4 mt-8">All-Time Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
                { icon: <Star/>, label: "Total Posts", value: analytics?.totalPosts || "0" },
                { icon: <Heart/>, label: "Avg Likes / Post", value: (analytics?.totalPosts || 0) > 0 ? (analytics!.totalLikes / analytics!.totalPosts).toFixed(1) : "0" },
                { icon: <MessageCircle/>, label: "Avg Comments / Post", value: (analytics?.totalPosts || 0) > 0 ? (analytics!.totalComments / analytics!.totalPosts).toFixed(1) : "0" },
                { icon: <Eye/>, label: "Total Impressions", value: "0" },
                { icon: <Users/>, label: "Total Reach", value: "0" },
                { icon: <UserPlus/>, label: "New Followers", value: "0", sub: "This Month" },
                { icon: <TrendingDown/>, label: "Unfollows", value: "0", sub: "This Month" },
                { icon: <Gift/>, label: "Gifts Sent", value: "0" },
                { icon: <Video/>, label: "Video Watch Time", value: "0 hrs" },
                { icon: <HelpCircle/>, label: "Support Tickets", value: "0" },
            ].map(item => (
                <Card key={item.label} className="glass-card border-0">
                    <CardContent className="p-4 text-center">
                        <div className="mx-auto h-8 w-8 text-primary mb-2 flex items-center justify-center">{item.icon}</div>
                        <div className="text-xl font-bold">{item.value}</div>
                        <p className="text-xs text-white/60">{item.label}</p>
                        {item.sub && <p className="text-[10px] text-white/50">{item.sub}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
