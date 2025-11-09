'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, UserPlus, Sparkles } from 'lucide-react';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type NotificationCardProps = {
    notification: Notification;
};

const iconMap = {
    like: <Heart className="h-5 w-5 text-white" />,
    comment: <MessageCircle className="h-5 w-5 text-white" />,
    follow: <UserPlus className="h-5 w-5 text-white" />,
    system: <Sparkles className="h-5 w-5 text-white" />,
};

const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
        case 'like':
            return <p><span className="font-bold">{notification.user.name}</span> liked your post.</p>;
        case 'comment':
            return <p><span className="font-bold">{notification.user.name}</span> commented: "{notification.commentText}"</p>;
        case 'follow':
            return <p><span className="font-bold">{notification.user.name}</span> started following you.</p>;
        case 'system':
             return <p><span className="font-bold">System Message:</span> {notification.commentText}</p>;
        default:
            return <p>New notification.</p>;
    }
}


export default function NotificationCard({ notification }: NotificationCardProps) {
    const router = useRouter();

    const formattedDate = formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true });
    
    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <li className={cn(
            "flex items-start gap-4 p-4 transition-colors",
            !notification.read && "bg-primary/5"
        )}>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                     notification.type === 'like' && 'bg-red-500/80',
                     notification.type === 'comment' && 'bg-blue-500/80',
                     notification.type === 'follow' && 'bg-green-500/80',
                     notification.type === 'system' && 'bg-purple-500/80',
                )}>
                    {iconMap[notification.type]}
                </div>
                 <Link href={`/users/${notification.user.id}`}>
                    <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarImage src={notification.user.avatarUrl} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
            <div className="flex-1 text-sm text-white/90">
                {getNotificationText(notification)}
                <p className="text-xs text-white/60 mt-1">{formattedDate}</p>
            </div>
            {notification.post && (
                <Link href={`/reviews/${notification.post.id}`}>
                     <div className="h-14 w-14 rounded-md overflow-hidden shrink-0">
                        <img src={notification.post.imageUrl} alt="Post image" className="h-full w-full object-cover" />
                    </div>
                </Link>
            )}
        </li>
    );
}
