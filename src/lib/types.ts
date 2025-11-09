





export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  price: string;
  rating: number;
};

export type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: any;
  likes: number;
  reviewId: string;
};

export type Review = {
  id:string;
  authorId: string;
  productId: string;
  rating: number; // 1-5
  text: string;
  imageId: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
};

export type PopulatedReview = Review & {
  user: User;
  product: Product;
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

export type Report = {
    id: string;
    postId: string;
    reporterId: string;
    reason: string;
    createdAt: any;
    resolved: boolean;
    resolvedAt?: any;
}

export type Transaction = {
    id: string;
    uid: string;
    action: string;
    type: 'earn' | 'spend';
    description: string;
    amount: number;
    date: string; // ISO 8601 format
};
    




