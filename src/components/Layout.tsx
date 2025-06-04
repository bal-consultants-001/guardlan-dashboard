'use client'

import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  return (
    <div className="min-h-screen flex bg-white text-gray-900">
      {/* Sidebar */}
	  <aside className="w-64 bg-gray-100 p-6 shadow-lg">
        <nav className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Navigation</h2>
          <Link href="/">
            <a className="block text-gray-800 hover:text-black">Home</a>
          </Link>
          <Link href="/shop">
            <a className="block text-gray-800 hover:text-black">Shop</a>
          </Link>
          {user ? (
		  <Link href="/dashboard">
            <a className="block text-gray-800 hover:text-black">Dashboard</a>
          </Link>
		  ) : (
		  <>
          <Link href="/login">
            <a className="block text-gray-800 hover:text-black">Login</a>
          </Link>
          <Link href="/register">
            <a className="block text-gray-800 hover:text-black">Register</a>
          </Link>
		  </>
		  )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  )
}