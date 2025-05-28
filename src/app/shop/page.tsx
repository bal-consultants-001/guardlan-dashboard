//shop page

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function ShopPage() {
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

  const products = [
    {
      id: 1,
      name: 'Home Network AdBlocker',
      price: '£75',
      description: 'Block ads for every device on your network.',
    },
    {
      id: 2,
      name: 'Monthly Subscription',
      price: '£6/mo',
      description: 'Continual filter updates and premium features.',
    },
    {
      id: 3,
      name: 'Hourly Support',
      price: '£25/hr',
      description: 'Technical help when you need it most.',
    },
  ]

  return (
    <main className="p-6">
      <section className="py-10 px-4 text-center">
        <div className="py-10 grid md:grid-cols-2 gap-6 float-right">
		  {user ? (
            <Link href="/dashboard">
              <a className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                Dashboard
              </a>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <a className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                  Register
                </a>
              </Link>
              <Link href="/login">
                <a className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                  Login
                </a>
              </Link>
            </>
          )}
		</div>
	  </section>
	  <section className="py-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-8">Shop Products</h1>
        <div className="space-x-4">
          <Link href="/">
            <a className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:text-white">
              Back to Home
            </a>
          </Link>
        </div>
      </section>

      <section className="py-10 grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="p-6 border rounded-lg shadow">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="my-2">{product.description}</p>
            <p className="font-semibold text-lg">{product.price}</p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        ))}
      </section>
    </main>
  )
}
