
import type { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  postCount: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  coins: number;
  createdAt: Timestamp;
};

export type Post = {
    id?: string;
    userId: string;
    caption: string;
    mediaUrl?: string;
    createdAt: any; // Can be a Date or a Firebase Timestamp
    visible?: boolean;
    likesCount?: number;
    commentsCount?: number;
    shareCount?: number;
    postType?: 'standard' | 'sponsored' | 'featured' | 'advertisement' | string;
    ctaText?: string;
    ctaLink?: string;
    adminUpload?: boolean;
}

// Deprecated, use Post instead
export type Review = {
  id: string;
  authorId: string;
  productName: string;
  rating: number;
  text: string;
  mediaUrl?: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  createdAt: Timestamp;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  author: User;
};


export interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  imageUrl: string;
  brand: string;
}

export type Transaction = {
  id: string;
  uid: string;
  type: 'earn' | 'spend';
  action: string;
  amount: number;
  description: string;
  date: string;
};

export type Comment = {
  id: string;
  reviewId: string;
  userId: string;
  text: string;
  createdAt: Timestamp;
  likes: number;
};

export type AppUser = {
  uid: string;
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  isFrozen?: boolean;
  points?: number;
  coins?: number;
  [key: string]: any;
}

export type Report = {
    id: string;
    postId: string;
    reporterId: string;
    reason: string;
    createdAt: any;
    resolved: boolean;
    resolvedAt?: any;
}

export type PopulatedReview = Review & {
  user: User;
  product: Product;
};

export type Notification = {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  post?: {
    id: string;
    imageUrl: string;
  };
  commentText?: string;
  createdAt: string; // ISO 8601 string
  read: boolean;
};

export type Message = {
    id?: string;
    senderId: string;
    text: string;
    createdAt: any;
    isBot?: boolean;
};

export type Conversation = {
    id: string;
    participants: string[];
    participantDetails: {
        id: string;
        name: string;
        avatarUrl: string;
    }[];
    lastMessage: string;
    lastMessageTimestamp: any;
    unreadCounts: {
        [userId: string]: number;
    }
}
