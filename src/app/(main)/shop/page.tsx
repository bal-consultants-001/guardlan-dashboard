//shop

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useCart } from '@/context/CartContext'
import { usePostcode } from '@/context/PostcodeContext';

const BUSINESS_COORDS = { lat: 51.501009, lon: -3.46716 }

type Product = {
  id: number
  name: string
  price: string
  priceAmount: number
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Home Network AdBlocker',
    price: '£75',
    priceAmount: 7500,
    description: 'Block Ads and filter content for every device on your network.',
  },
  {
    id: 2,
    name: 'Monthly Subscription',
    price: '£6/month',
    priceAmount: 600,
    description: 'Regular updates, proactive support, blocking insights and assistance.',
  },
  {
    id: 3,
    name: 'Hourly Support',
    price: '£25/hr',
    priceAmount: 2500,
    description: 'Technical help or training when you need it most.',
  },
]

function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function ShopPage() {
  const [user, setUser] = useState<User | null>(null)
  const [postcodeInput, setPostcodeInput] = useState('')
  const { serviceable, setServiceable } = usePostcode();
  const [showNotifyForm, setShowNotifyForm] = useState(false)
  const [message, setMessage] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const handleCheckPostcode = async () => {
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${postcodeInput}`)
      const data = await res.json()

      if (data.status === 200) {
        const { latitude, longitude } = data.result
        const distance = getDistanceMiles(latitude, longitude, BUSINESS_COORDS.lat, BUSINESS_COORDS.lon)

        if (distance <= 20) {
          setServiceable(true)
          setMessage('✅ We service your area!')
        } else {
          setServiceable(false)
          setMessage('❌ Sorry, we don’t service your area.')
          setShowNotifyForm(true)
        }
      } else {
        setMessage('❌ Invalid postcode. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setMessage('❌ Error checking postcode.')
    }
  }

  return (
	<>
      {/* Auth Actions */}
      <section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full py-4 overflow-hidden">
        <div className="flex justify-end gap-4 px-6">
          {user ? (
            <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Home</Link>
			<Link href="/dashboard" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Dashboard</Link>
          ) : (
            <>
              <Link href="/register" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Register</Link>
              <Link href="/login" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Login</Link>
            </>
          )}
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Shop Products</h1>
        <p className="mb-6 text-lg">
          Our hardware AdBlocker GuardLAN secures your whole network from intrusive ads and trackers.
        </p>
        <Link href="#products" className="btn bg-black text-white">
          Shop Now
        </Link>
      </section>

      {/* Postcode Check */}
      <section className="p-4 bg-white text-center">
        <h2 className="text-xl font-semibold mb-2">Check if we service your area</h2>
        <div className="flex justify-center gap-2 mb-2">
          <input
            className="border p-2 w-64"
            placeholder="Enter your postcode"
            value={postcodeInput}
            onChange={(e) => setPostcodeInput(e.target.value)}
          />
          <button className="btn bg-blue-600 text-white" onClick={handleCheckPostcode}>
            Check
          </button>
        </div>
        {message && (
          <p className={serviceable ? 'text-green-600' : 'text-red-600'}>{message}</p>
        )}
      </section>

      {/* Notify Modal */}
      {showNotifyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Notify Me</h2>
            <p>Unfortunately we do not currently provide our service to your Postcode. If you are interested please fill in the form below, thank you.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const name = formData.get('name')
                const email = formData.get('email')
                console.log({ name, email, postcode: postcodeInput })
                setShowNotifyForm(false)
                setPostcodeInput('')
                setServiceable(null)
                setMessage('')
              }}
              className="space-y-3"
            >
              <input name="name" required className="w-full border p-2" placeholder="Name" />
              <input name="email" required type="email" className="w-full border p-2" placeholder="Email" />
              <button type="submit" className="btn bg-blue-600 text-white w-full">Notify Me</button>
              <button
                type="button"
                onClick={() => {
                  setShowNotifyForm(false)
                  setPostcodeInput('')
                  setServiceable(null)
                  setMessage('')
                }}
                className="text-sm text-gray-500 mt-2 hover:underline"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      <section id="products" className="bg-[linear-gradient(30deg,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full py-4 overflow-hidden px-4 text-white grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white text-black p-6 rounded shadow">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="mt-2">{product.description}</p>
            <p className="mt-2 font-semibold">{product.price}</p>
            <button
              className="btn mt-4 bg-black text-white"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </section>
	</>
  )
}
