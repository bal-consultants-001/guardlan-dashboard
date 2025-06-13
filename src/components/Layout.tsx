'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { usePostcode } from '@/context/PostcodeContext';

//import { PostcodeProvider } from '@/content/PostcodeContext';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { serviceable } = usePostcode();

  const { cart, removeFromCart, addToCart, decreaseQuantity } = useCart();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

	  // Subscribe to auth changes
	  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
		setUser(session?.user ?? null);
	  });

    const timer = setTimeout(() => setCollapsed(true), 3000);
    return () => {
	  clearTimeout(timer);
	  authListener?.subscription.unsubscribe();
	};
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
	setUser(null);
    router.push('/');
  };

  const isExpanded = !collapsed || hovering;

  return (
    <div className="min-h-screen flex text-gray-900 relative">
      {/* Sidebar */}
      <aside
        className={`
          bg-gray-100 shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-10'}
        `}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <nav className="p-4 space-y-4 sticky top-0">
          {isExpanded ? (
            <>
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <Link href="/" className="block hover:text-black">Home</Link>
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

      {/* Main Content */}
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

				{/* Conditional Checkout Buttons */}
				{user && serviceable ? (
				  <Link href="/shop?checkout=true" className="block mt-4 bg-green-600 text-white text-center py-2 rounded hover:bg-green-700">
					Checkout
				  </Link>
				) : (
				  <div className="mt-4">
					<p className="text-sm text-red-600 text-center mb-2">
					  You must be logged in and in a serviceable area to checkout.
					</p>
					<div className="flex justify-between gap-2">
					  <Link href="/login" className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</Link>
					  <Link href="/register" className="flex-1 text-center bg-black text-white py-2 rounded hover:bg-gray-800">Register</Link>
					</div>
				  </div>
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
