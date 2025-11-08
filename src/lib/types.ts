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
};

export type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
};

export type Review = {
  id: string;
  userId: string;
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
}
