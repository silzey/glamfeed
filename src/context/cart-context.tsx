'use client';
import { createContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';

export type CartItem = Product & {
    price: string; // Ensure price is always a string for display
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isInCart: () => false,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      if (prevItems.find(i => i.id === item.id)) {
        toast({ title: 'Item is already in your cart.' });
        return prevItems;
      }
      toast({ title: 'Added to cart!', description: item.name });
      return [...prevItems, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(i => i.id === id);
      if (itemToRemove) {
        toast({
          title: 'Removed from cart',
          description: itemToRemove.name,
          variant: 'destructive',
        });
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({ title: 'Cart cleared', variant: 'destructive' });
  };

  const isInCart = (id: string) => {
    return cartItems.some(item => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
