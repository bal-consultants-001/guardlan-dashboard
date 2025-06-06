'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [hovering, setHovering] = useState(false)

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    router.push('/');
  }
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const timer = setTimeout(() => {
      setCollapsed(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const isExpanded = !collapsed || hovering

  return (
    <div className="min-h-screen flex text-gray-900">
      {/* Sidebar */}
      <aside
        className={`
          bg-gray-100 shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-10'}
        `}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <nav className="p-4 space-y-4">
          {isExpanded ? (
            <>
              <h2 className="text-xl font-bold mb-4">Navigation</h2>
              <Link href="/" className="block hover:text-black">Home</Link>
              <Link href="/shop" className="block hover:text-black">Shop</Link>
              {user ? (
				<>
                <Link href="/dashboard" className="block hover:text-black">Dashboard</Link>
				<button className="block hover:text-black" onClick={handleLogout}>Log Out</button>
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
              <span className="text-xs transform rotate-90 whitespace-nowrap">Navigation</span>
            </div>
          )}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
