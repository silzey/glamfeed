
'use client';
import { useContext } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/cart-context';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="flex items-center gap-4 mb-8">
            <ShoppingCart
                className="h-10 w-10 text-primary"
                style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
            />
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Checkout</h1>
                <p className="text-md sm:text-lg text-white/70">
                    Review your items and complete your purchase.
                </p>
            </div>
        </div>

        <div className="glass-card p-4 sm:p-6 md:p-8">
            {cartItems.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-white/70">{item.brand}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <p className="font-semibold text-primary">${item.price}</p>
                                     <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-white/50 hover:text-red-500 h-8 w-8">
                                        <Trash2 className="h-4 w-4" />
                                     </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Separator className="my-6 bg-white/10"/>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <p className="text-white/70">Subtotal</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                         <div className="flex justify-between">
                            <p className="text-white/70">Taxes (8%)</p>
                            <p>${tax.toFixed(2)}</p>
                        </div>
                         <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                    </div>
                     <Separator className="my-6 bg-white/10"/>
                     <Button size="lg" className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                        Proceed to Payment
                     </Button>
                     <Button variant="outline" onClick={clearCart} className="w-full mt-2">Clear Cart</Button>
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-lg text-white/70">Your cart is empty.</p>
                     <Button asChild variant="link" className="mt-2 text-primary">
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
