'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [hovering, setHovering] = useState(false)

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
    <div className="min-h-screen flex bg-white text-gray-900">
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
              <Link href="/"><a className="block hover:text-black">Home</a></Link>
              <Link href="/shop"><a className="block hover:text-black">Shop</a></Link>
              {user ? (
                <Link href="/dashboard"><a className="block hover:text-black">Dashboard</a></Link>
              ) : (
                <>
                  <Link href="/login"><a className="block hover:text-black">Login</a></Link>
                  <Link href="/register"><a className="block hover:text-black">Register</a></Link>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-xs transform -rotate-90 whitespace-nowrap">Navigation</span>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  )
}
