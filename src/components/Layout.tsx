'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import { usePostcode } from '@/context/PostcodeContext';
import Image from 'next/image';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showCart, setShowCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { serviceable } = usePostcode();
  const { cart, removeFromCart, addToCart, decreaseQuantity } = useCart();

  useEffect(() => {
    if (cart.length === 0 && showCart) {
      setShowCart(false);
    }
  }, [cart, showCart]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Sticky Top Navigation */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/bal-it-grayscale.png"
              alt="BAL-IT"
              width={160}
              height={80}
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/shop" className="hover:text-blue-600">Shop</Link>
			<Link href="/contact" className="hover:text-blue-600">Contact</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                <Link href="/support" className="hover:text-blue-600">Tickets</Link>
                <button onClick={handleLogout} className="hover:text-red-600">Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-600">Login</Link>
                <Link href="/register" className="hover:text-blue-600">Register</Link>
              </>
            )}
          </nav>

          {/* Cart & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <button
			  onClick={() => {
				if (cart.length > 0) {
				  setShowCart((prev) => !prev);
				}
			  }}
			  className={`relative p-2 rounded-full ${cart.length > 0 ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'} text-white`}
			  aria-label="Cart"
			>

              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="md:hidden">
              {mobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-6 py-4 space-y-2 shadow">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block">Home</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block">About</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block">Shop</Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block">Dashboard</Link>
                <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="block">Tickets</Link>
                <button onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }} className="block text-left w-full text-red-600">Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">Login</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block">Register</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Spacer below sticky nav */}
      <div className="h-20 md:h-24" />

      {/* Cart Dropdown */}
      {showCart && (
        <div className="fixed top-24 right-4 w-80 bg-white shadow-lg rounded p-4 border z-40">
          <h3 className="font-bold text-lg mb-2">Cart</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => decreaseQuantity(item.id)} className="text-xs bg-gray-200 px-2 py-1 rounded">−</button>
                  <button onClick={() => addToCart(item)} className="text-xs bg-gray-200 px-2 py-1 rounded">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded">X</button>
                </div>
              </li>
            ))}
          </ul>

          {!user ? (
            <div className="mt-4">
              <p className="text-sm text-red-600 text-center mb-2">You must be logged in and within a valid Postcode to checkout.</p>
              <div className="flex justify-between gap-2">
                <Link href="/login" className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</Link>
                <Link href="/register" className="flex-1 text-center bg-black text-white py-2 rounded hover:bg-gray-800">Register</Link>
              </div>
            </div>
          ) : !serviceable ? (
            <div className="mt-4">
              <p className="text-sm text-red-600 text-center">
                Please enter a valid postcode within our serviceable area to proceed to checkout.
              </p>
            </div>
          ) : (
            <Link href="/shop?checkout=true" className="block mt-4 bg-green-600 text-white text-center py-2 rounded hover:bg-green-700">Checkout</Link>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {children}
      </main>
	        {/* Footer */}
      <footer className="bg-black text-white py-8 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} BAL-IT. All rights reserved.</p>
      </footer>
	  
    </div>
  );
}
