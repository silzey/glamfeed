
'use client';
import { useContext } from 'react';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/cart-context';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import './checkout.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="checkout-body">
      <div className="container">
        <div className="window">
          <div className="order-info">
            <div className="order-info-content">
              <h2>Order Summary</h2>
              <div className="line"></div>
              {cartItems.length > 0 ? (
                <>
                    <table className="order-table">
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="full-width"/>
                                    </td>
                                    <td>
                                        <br /> <span className="thin">{item.name}</span>
                                        <br /> {item.brand}<br /> <span className="thin small">Quantity: 1</span>
                                    </td>
                                    <td>
                                        <div className="price">${item.price}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="line"></div>
                    <div className="total">
                        <span style={{ float: 'left' }}>
                            <div className="thin dense">Subtotal</div>
                            <div className="thin dense">Tax</div>
                            TOTAL
                        </span>
                        <span style={{ float: 'right', textAlign: 'right' }}>
                            <div className="thin dense">${subtotal.toFixed(2)}</div>
                            <div className="thin dense">${tax.toFixed(2)}</div>
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </>
              ) : (
                <div className="text-center py-12">
                    <p className="text-lg text-black/70">Your cart is empty.</p>
                     <Button asChild variant="link" className="mt-2 text-primary">
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>
              )}
            </div>
          </div>
          <div className="credit-info">
            <div className="credit-info-content">
              <table className='half-input-table'>
                <tbody>
                  <tr>
                    <td>Please select your card: </td>
                    <td>
                      <div className='dropdown' id='card-dropdown'>
                        <div className='dropdown-btn' id='current-card'>Visa</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <img src='https://dl.dropboxusercontent.com/s/ubamyu6dpjc5xow/cc.png' height='80' className='credit-card-image' id='credit-card-image' alt="credit card"/>
              Card Number
              <input className='input-field'></input>
              Card Holder
              <input className='input-field'></input>
              <table className='half-input-table'>
                <tbody>
                  <tr>
                    <td>
                      Expires
                      <input className='input-field'></input>
                    </td>
                    <td>
                      CVC
                      <input className='input-field'></input>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button className='pay-btn'>Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    