'use client';

import { mockNotifications } from '@/lib/notifications';
import NotificationCard from './notification-card';
import { Button } from './ui/button';

export function NotificationFeed() {
    
    if (!mockNotifications || mockNotifications.length === 0) {
        return (
            <div className="text-center py-20 glass-card">
                <p className="text-lg text-white/70">No new notifications.</p>
                <p className="text-sm text-white/50 mt-2">You're all caught up!</p>
            </div>
        );
    }

    return (
        <div className="glass-card">
            <div className="p-4 flex justify-between items-center border-b border-white/10">
                <h2 className="font-semibold">Recent Activity</h2>
                <Button variant="ghost" size="sm">Mark all as read</Button>
            </div>
            <ul className="divide-y divide-white/10">
                {mockNotifications.map(notification => (
                    <NotificationCard key={notification.id} notification={notification} />
                ))}
            </ul>
        </div>
    );
}
