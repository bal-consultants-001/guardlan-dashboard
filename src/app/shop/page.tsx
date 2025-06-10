//shop

'use client'



import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { loadStripe } from '@stripe/stripe-js'
import Layout from '@/components/Layout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type Product = {
  id: number
  name: string
  price: string
  priceAmount: number
  description: string
}

type CartItem = Product & { quantity: number }

export default function ShopPage() {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])

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
  setCart((prevCart) => {
    const existing = prevCart.find((item) => item.id === product.id)
    if (existing) {
      return prevCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      return [...prevCart, { ...product, quantity: 1 }]
    }
  })
}

  const removeFromCart = (productId: number) => {
	setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const decreaseQuantity = (productId: number) => {
  setCart((prevCart) =>
    prevCart
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0)
  )
}


	const handleCheckout = async () => {
	  const stripe = await stripePromise

	  const lineItems = cart.map((item) => ({
		price_data: {
		  currency: 'gbp',
		  product_data: { name: item.name },
		  unit_amount: item.priceAmount,
		},
		quantity: item.quantity,
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
    <Layout>
      {/* Header / Nav */}
      <section className="bg-[linear-gradient(30deg,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full py-0 overflow-hidden">
        <div className="py-10 grid md:grid-cols-2 gap-6 float-right">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
              
                Dashboard
              
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                
                  Register
                
              </Link>
              <Link
                href="/login"
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                
                  Login
                
              </Link>
            </>
          )}
        </div>
      </section>
      {/* Shop Header */}
      <section className="py-20 px-4 text-center">
	  	  <div className="py-20 flex justify-center">
			<div className="flex flex-col items-center max-w-2x1 text-center">
				<h1 className="text-3xl font-bold mb-8">Shop Products</h1>
				<div className="space-x-4">
				<p className="text-lg mb-4">
				  Our hardware AdBlocker GuardLAN secures your whole network from intrusive ads and trackers.
				</p>
			  </div>
			  <div>
				<Link
                  href="/shop"
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
				  
					Shop Now
				  
				</Link>
			  </div>
			</div>
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
		  <ul className="mb-4 space-y-3">
			{cart.map((item) => (
			  <li key={item.id} className="flex justify-between items-center">
				<div>
				  <span className="font-semibold">{item.name}</span> — {item.price}
				  <div className="text-sm text-gray-600">
					Quantity: {item.quantity}
				  </div>
				</div>
				<div className="flex items-center space-x-2">
				  <button
					onClick={() => decreaseQuantity(item.id)}
					className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
				  >
					−
				  </button>
				  <button
					onClick={() => addToCart(item)}
					className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
				  >
					+
				  </button>
				  <button
					onClick={() => removeFromCart(item.id)}
					className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
				  >
					Remove
				  </button>
				</div>
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
    </Layout>
  );
}
