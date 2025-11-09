
import type { Product } from './types';

// Mock product data
const products: Product[] = [
    {
        id: 'prod-1',
        name: 'Luminous Silk Foundation',
        brand: 'Giorgio Armani',
        imageUrl: 'https://images.unsplash.com/photo-1682618901459-54ae8c166d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmb3VuZGF0aW9uJTIwYm90dGxlc3xlbnwwfHx8fDE3NjI2MDMwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: '6900', // in cents
        rating: 4.9,
    },
    {
        id: 'prod-2',
        name: 'Radiant Creamy Concealer',
        brand: 'NARS',
        imageUrl: 'https://images.unsplash.com/photo-1590152994408-e43543534125?q=80&w=2187&auto=format&fit=crop',
        price: '3200',
        rating: 4.8,
    },
    {
        id: 'prod-3',
        name: 'Touche Éclat All-In-One Glow',
        brand: 'YSL Beauty',
        imageUrl: 'https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=2187&auto=format&fit=crop',
        price: '4800',
        rating: 4.5,
    },
    {
        id: 'prod-4',
        name: 'Ultra HD Pressed Powder',
        brand: 'MAKE UP FOR EVER',
        imageUrl: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxza2luY2FyZSUyMHByb2R1Y3RzfGVufDB8fHx8MTc2MjUzMTM0OXww&ixlib=rb-4.1.0&q=80&w=1080',
        price: '3700',
        rating: 4.7,
    },
    {
        id: 'prod-5',
        name: 'Dior Addict Lip Glow',
        brand: 'Dior',
        imageUrl: 'https://images.unsplash.com/photo-1671288239289-f01976a87c43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGxpcHN0aWNrfGVufDB8fHx8MTc2MjYwMzAwNHww&ixlib=rb-4.1.0&q=80&w=1080',
        price: '4000',
        rating: 4.9,
    },
    {
        id: 'prod-6',
        name: 'Eyeshadow Palette',
        brand: 'Urban Decay',
        imageUrl: 'https://images.unsplash.com/photo-1625094640367-05f84293fe42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxleWVzaGFkb3clMjBwYWxldHRlfGVufDB8fHx8MTc2MjU1NjI0NHww&ixlib=rb-4.1.0&q=80&w=1080',
        price: '5400',
        rating: 4.8,
    }
];

// Simulate an API call
export const getProducts = async (): Promise<Product[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(products);
    }, 500); // Simulate network delay
  });
};
