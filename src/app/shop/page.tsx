//shop

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type Product = {
  id: number
  name: string
  price: string
  priceAmount: number
  description: string
}

export default function ShopPage() {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<Product[]>([])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  const products: Product[] = [
    {
      id: 1,
      name: 'Home Network AdBlocker',
      price: '£75',
      priceAmount: 7500,
      description: 'Block ads for every device on your network.',
    },
    {
      id: 2,
      name: 'Monthly Subscription',
      price: '£6/mo',
      priceAmount: 600,
      description: 'Continual filter updates and premium features.',
    },
    {
      id: 3,
      name: 'Hourly Support',
      price: '£25/hr',
      priceAmount: 2500,
      description: 'Technical help when you need it most.',
    },
  ]

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product])
  }

  const handleCheckout = async () => {
    const stripe = await stripePromise

    // Convert cart items to Stripe format
    const lineItems = cart.map((product) => ({
      price_data: {
        currency: 'gbp',
        product_data: { name: product.name },
        unit_amount: product.priceAmount,
      },
      quantity: 1,
    }))

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: lineItems }),
    })

    const { sessionId } = await res.json()
    await stripe?.redirectToCheckout({ sessionId })
  }

  return (
    <main className="p-6">
      {/* Header / Nav */}
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

      {/* Shop Header */}
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

      {/* Product List */}
      <section className="py-10 grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="p-6 border rounded-lg shadow">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="my-2">{product.description}</p>
            <p className="font-semibold text-lg">{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </section>

      {/* Cart Section */}
      {cart.length > 0 && (
        <section className="py-10 px-4 mt-10 border-t">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          <ul className="mb-4">
            {cart.map((item, index) => (
              <li key={index} className="mb-2">
                {item.name} – {item.price}
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Checkout
          </button>
        </section>
      )}
    </main>
  )
}
