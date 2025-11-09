import type { Notification } from './types';

export const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'like',
        user: {
            id: 'user-2',
            name: 'Ben Styles',
            avatarUrl: 'https://i.pravatar.cc/150?u=user-2'
        },
        post: {
            id: 'rev-1',
            imageUrl: 'https://images.unsplash.com/photo-1682618901459-54ae8c166d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmb3VuZGF0aW9uJTIwYm90dGxlc3xlbnwwfHx8fDE3NjI2MDMwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false
    },
    {
        id: '2',
        type: 'comment',
        user: {
            id: 'user-3',
            name: 'Aisha Glow',
            avatarUrl: 'https://i.pravatar.cc/150?u=user-3'
        },
        post: {
            id: 'rev-1',
            imageUrl: 'https://images.unsplash.com/photo-1682618901459-54ae8c166d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmb3VuZGF0aW9uJTIwYm90dGxlc3xlbnwwfHx8fDE3NjI2MDMwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        commentText: "This looks amazing! I have to try it.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false
    },
    {
        id: '3',
        type: 'follow',
        user: {
            id: 'user-4',
            name: 'Marco Looks',
            avatarUrl: 'https://i.pravatar.cc/150?u=user-4'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: true
    },
     {
        id: '4',
        type: 'system',
        user: { // System notifications might use a generic user or a specific system user
            id: 'system',
            name: 'GlamFeed',
            avatarUrl: '/glamfeed-logo.png' // A generic logo
        },
        commentText: "Your weekly digest is ready! Check out the top 5 trending products.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        read: true
    },
];
