import type { User, Product, Review } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

export const users: User[] = [
  { id: 'user-1', name: 'Chloe', username: 'chloe_beauty', avatarUrl: 'https://i.pravatar.cc/150?u=user-1' },
  { id: 'user-2', name: 'Ben', username: 'ben_styles', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
  { id: 'user-3', name: 'Aisha', username: 'aishas_glow', avatarUrl: 'https://i.pravatar.cc/150?u=user-3' },
  { id: 'user-4', name: 'Marco', username: 'marco_looks', avatarUrl: 'https://i.pravatar.cc/150?u=user-4' },
];

export const products: Product[] = [
  { id: 'prod-1', name: 'Luminous Silk Foundation', brand: 'Giorgio Armani' },
  { id: 'prod-2', name: 'Radiant Creamy Concealer', brand: 'NARS' },
  { id: 'prod-3', name: 'Touche Éclat All-In-One Glow', brand: 'YSL Beauty' },
  { id: 'prod-4', name: 'Ultra HD Pressed Powder', brand: 'MAKE UP FOR EVER' },
  { id: 'prod-5', name: 'Dior Addict Lip Glow', brand: 'Dior' },
];

export const reviews: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-1',
    productId: 'prod-1',
    rating: 5,
    text: "Absolutely in love with the Luminous Silk Foundation! It gives my skin such a natural, radiant finish without feeling heavy. I've tried countless foundations, and this is by far the best. It blends seamlessly and lasts all day. People keep complimenting my skin, not my makeup. It is a bit pricey, but a little goes a long way, so the bottle lasts for ages. If you're on the fence, I'd say it's definitely worth the investment for that flawless, lit-from-within glow. It doesn't settle into fine lines and photographs beautifully. A true holy grail product!",
    imageId: 'review-image-5',
    likes: 142,
    comments: [
      { id: 'c-1-1', userId: 'user-2', text: 'I agree, it\'s amazing!', createdAt: '2024-05-20T10:05:00Z' },
    ],
    createdAt: '2024-05-20T10:00:00Z',
  },
  {
    id: 'rev-2',
    userId: 'user-2',
    productId: 'prod-2',
    rating: 4,
    text: 'The NARS Radiant Creamy Concealer is a staple in my makeup bag. It has great coverage for blemishes and under-eye circles. The only reason I\'m not giving it 5 stars is that it can sometimes crease a little if I don\'t set it with powder right away. But overall, the creamy texture and range of shades are fantastic. It really brightens up the face.',
    imageId: 'review-image-2',
    likes: 89,
    comments: [],
    createdAt: '2024-05-19T15:30:00Z',
  },
  {
    id: 'rev-3',
    userId: 'user-3',
    productId: 'prod-5',
    rating: 5,
    text: "The Dior Addict Lip Glow is my everyday essential. It's the perfect 'my lips but better' product. It's hydrating like a balm but gives a beautiful, subtle hint of color that adapts to your natural lip tone. I have it in a couple of shades and they are all gorgeous. It's not sticky at all and feels so comfortable to wear. I can just pop it on without a mirror. Highly recommend for a polished, effortless look. It's been a game changer for my daily routine, simplifying everything while still looking put together. I've repurchased this more times than I can count!",
    imageId: 'review-image-1',
    likes: 231,
    comments: [
      { id: 'c-3-1', userId: 'user-1', text: 'Totally my favorite!', createdAt: '2024-05-19T12:15:00Z' },
      { id: 'c-3-2', userId: 'user-4', text: 'Need to try this!', createdAt: '2024-05-19T12:20:00Z' },
    ],
    createdAt: '2024-05-18T09:00:00Z',
  },
  {
    id: 'rev-4',
    userId: 'user-4',
    productId: 'prod-3',
    rating: 3,
    text: 'I had high hopes for the YSL Touche Éclat All-In-One Glow. It\'s okay, but not my favorite. The coverage is very light, which is fine for good skin days, but not enough for when I need a bit more help. It does give a nice dewy finish, but I found it a bit too "glowy" for my combination skin by the end of the day. It might be better suited for someone with drier skin types.',
    imageId: 'review-image-3',
    likes: 45,
    comments: [],
    createdAt: '2024-05-17T18:45:00Z',
  },
];
