'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function HomePage() {
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
    <main className="min-h-screen bg-white text-gray-900">
      <section className="py-10 px-4 text-center">
        <div className="py-10 grid md:grid-cols-2 gap-6 float-right">
          {user ? (
            <Link href="/dashboard">
              <a className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                Dashboard
              </a>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <a className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                  Register
                </a>
              </Link>
              <Link href="/login">
                <a className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                  Login
                </a>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Protect Your Home from Ads</h1>
        <p className="text-lg mb-6">
          Our hardware AdBlocker GuardLAN secures your whole network from intrusive ads and trackers.
        </p>
        <Link href="/shop">
          <a className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
            Shop Now
          </a>
        </Link>
      </section>

      <section className="py-10 px-4 grid md:grid-cols-3 gap-6">
        <div className="p-6 shadow-lg rounded-lg border">
          <h2 className="text-xl font-bold mb-2">AdBlocker Device</h2>
          <p>A robust device to filter out ads on your entire home network.</p>
        </div>
        <div className="p-6 shadow-lg rounded-lg border">
          <h2 className="text-xl font-bold mb-2">Monthly Subscription</h2>
          <p>Stay updated with threat lists and enjoy continuous blocking improvements.</p>
        </div>
        <div className="p-6 shadow-lg rounded-lg border">
          <h2 className="text-xl font-bold mb-2">Hourly Support</h2>
          <p>Need help with issues or troubleshooting? We’ve got your back by the hour.</p>
        </div>
      </section>
    </main>
  )
}
