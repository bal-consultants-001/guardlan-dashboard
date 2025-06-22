'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import { usePostcode } from '@/context/PostcodeContext';

//import { PostcodeProvider } from '@/content/PostcodeContext';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user } =useAuth();
  const [collapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { serviceable } = usePostcode();

  const { cart, removeFromCart, addToCart, decreaseQuantity } = useCart();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isExpanded = !collapsed || hovering;

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-gray-900 relative">
      {/* Sidebar for desktop */}
      <aside
        className={`
          hidden md:block bg-gray-100 shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-40' : 'w-10'}
        `}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <nav className="p-4 space-y-4 sticky top-0">
          {isExpanded ? (
            <>
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <Link href="/" className="block hover:text-black">Home</Link>
			  <Link href="/about" className="block hover:text-black">About</Link>
              <Link href="/shop" className="block hover:text-black">Shop</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="block hover:text-black">Dashboard</Link>
                  <Link href="/support" className="block hover:text-black">Tickets</Link>
                  <button className="block hover:text-gray" onClick={handleLogout}>Log Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block hover:text-black">Login</Link>
                  <Link href="/register" className="block hover:text-black">Register</Link>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-4">
              <span className="text-m transform rotate-90 whitespace-nowrap">Menu</span>
            </div>
          )}
        </nav>
      </aside>

      {/* Mobile top nav */}
		<header
		  className={`md:hidden transition-colors duration-300 shadow p-4 flex justify-center relative ${
			mobileMenuOpen
			  ? 'bg-white'
			  : 'bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))]'
		  }`}
		>
		  <button
			onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
			className="fixed left-1/2 transform -translate-x-1/2 z-50 p2 rounded top-4 text-white"
		  >
			{mobileMenuOpen ? (
			  <CloseIcon className="w-6 h-6 text-black" />
			) : (
			  <MenuIcon className="w-6 h-6" />
			)}
		  </button>

		  {/* Centered logo or leave empty for now */}
		  <div className="text-center text-white font-semibold">
			{/* Optional logo or title */}
		  </div>

		  {/* Dropdown Menu */}
		  {mobileMenuOpen && (
			<div className="absolute top-full left-0 w-full bg-white shadow-md z-40 p-4 space-y-2">
			  <Link href="/" className="block" onClick={() => setMobileMenuOpen(false)}>Home</Link>
			  <Link href="/about" className="block hover:text-black">About</Link>
			  <Link href="/shop" className="block" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
			  {user ? (
				<>
				  <Link href="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
				  <Link href="/support" className="block" onClick={() => setMobileMenuOpen(false)}>Tickets</Link>
				  <button
					onClick={() => {
					  setMobileMenuOpen(false);
					  handleLogout();
					}}
					className="block text-left w-full"
				  >
					Log Out
				  </button>
				</>
			  ) : (
				<>
				  <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>Login</Link>
				  <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>Register</Link>
				</>
			  )}
			</div>
		  )}
		</header>
		
      {/* Main content */}
      <main className="flex-1 relative bg-white">
        {/* Floating Cart */}
        {cart.length > 0 && (
          <section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full h-16">
            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={() => setShowCart((prev) => !prev)}
                className="relative p-2 rounded-full bg-black text-white hover:bg-gray-800"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </button>

              {showCart && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded p-4 border">
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

                  {/* Conditional Checkout */}
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
            </div>
          </section>
        )}
        {children}
      </main>
    </div>
  );
}