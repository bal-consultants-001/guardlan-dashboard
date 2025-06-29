//shop

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import { usePostcode } from '@/context/PostcodeContext'

const BUSINESS_COORDS = { lat: 51.501009, lon: -3.46716 }

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
  const [postcodeInput, setPostcodeInput] = useState('')
  const { serviceable, setServiceable } = usePostcode()
  const [showNotifyForm, setShowNotifyForm] = useState(false)
  const [subscriptionSelected, setSubscriptionSelected] = useState(false)
  const [message, setMessage] = useState('')
  const { addToCart } = useCart()
  const router = useRouter()

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

  const adblockerImages = [
    '/images/AdBlocker9.jpg',
    '/images/AdBlocker1.png',
    '/images/AdBlocker2.png',
    '/images/AdBlocker5.png',
  ]

  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openGallery = (index: number) => {
    setCurrentImageIndex(index)
    setIsGalleryOpen(true)
  }

  const closeGallery = () => setIsGalleryOpen(false)
  const showNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % adblockerImages.length)
  const showPrevImage = () => setCurrentImageIndex((prev) => (prev - 1 + adblockerImages.length) % adblockerImages.length)

  const handleAddToCartAndCheckout = () => {
    addToCart({
      id: 1,
      name: 'Home Network AdBlocker',
      price: '£75',
      priceAmount: 7500,
      description: 'Block Ads and filter content for every device on your network.',
    })

    if (subscriptionSelected) {
      addToCart({
        id: 2,
        name: 'Monthly Subscription',
        price: '£6/month',
        priceAmount: 600,
        description: 'Support + updates for the AdBlocker.',
      })
    }

    router.push('?checkout=true')
  }

  return (
    <>
      {/* Intro */}
      <section className="py-16 px-4 text-center bg-white">
        <h1 className="text-4xl font-bold mb-4">Shop Products</h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Our hardware AdBlocker GuardLAN secures your whole network from intrusive ads and trackers.
        </p>
      </section>

      {/* Postcode Check */}
      <section className="p-6 bg-gray-50 text-center">
        <h2 className="text-xl font-semibold mb-2">Check if we service your area</h2>
        <div className="flex justify-center gap-2 flex-wrap mb-3">
          <input
            className="border border-gray-300 p-2 w-64 rounded"
            placeholder="Enter your postcode"
            value={postcodeInput}
            onChange={(e) => setPostcodeInput(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleCheckPostcode}>
            Check
          </button>
        </div>
        {message && <p className={serviceable ? 'text-green-600' : 'text-red-600'}>{message}</p>}
      </section>

      {/* Product Section */}
      <section className="bg-gradient-to-r from-red-500 via-purple-600 to-blue-600 text-white py-20">
        <div className="bg-black/40 rounded-xl max-w-5xl mx-auto p-10 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Home Network AdBlocker</h2>
            <p className="text-lg mb-4">Block ads, trackers, and unwanted content across every device on your home network.</p>
            <p className="text-2xl font-semibold">£75 (one-time)</p>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {adblockerImages.map((src, i) => (
              <div key={i} className="relative w-full aspect-[4/3] rounded overflow-hidden shadow cursor-pointer" onClick={() => openGallery(i)}>
                <Image src={src} alt={`AdBlocker ${i + 1}`} fill className="object-cover hover:opacity-80 transition" />
              </div>
            ))}
          </div>

          {/* Subscription Add-on */}
          <div className="bg-white text-black p-6 rounded mb-6">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={subscriptionSelected} onChange={() => setSubscriptionSelected(!subscriptionSelected)} />
              <span><strong>Monthly Subscription (£6/month)</strong><br />Includes support, updates, and usage reports.</span>
            </label>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button onClick={handleAddToCartAndCheckout} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button className="absolute top-6 right-6 text-white text-3xl" onClick={closeGallery}>&times;</button>
          <button className="absolute left-6 text-white text-4xl" onClick={showPrevImage}>&#10094;</button>
          <Image src={adblockerImages[currentImageIndex]} alt="Gallery" className="max-w-[90vw] max-h-[80vh] rounded-lg shadow" />
          <button className="absolute right-6 text-white text-4xl" onClick={showNextImage}>&#10095;</button>
        </div>
      )}

      {/* Hourly Support */}
      <section className="bg-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Hourly Support</h2>
          <p className="text-lg mb-1">Need extra help or training?</p>
          <p className="text-xl font-semibold text-blue-600 mb-4">£25/hr (Invoiced)</p>
          <p className="mb-6">Technical assistance, remote troubleshooting, or custom configurations — billed after service.</p>
          <Link href="/contact" className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Notify Modal */}
      {showNotifyForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-2">Notify Me</h2>
            <p className="text-sm mb-4">
              We don’t currently provide service in your area. Fill out your details and we’ll let you know when we do.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                const name = form.get('name')
                const email = form.get('email')

                if (!name || !email || !postcodeInput) return

                const { error } = await supabase.from('interest').insert([{ name, email, postcode: postcodeInput }])
                if (error) console.error(error.message)

                setShowNotifyForm(false)
                setPostcodeInput('')
                setServiceable(null)
                setMessage('')
              }}
              className="space-y-3"
            >
              <input name="name" required className="w-full border p-2 rounded" placeholder="Name" />
              <input name="email" required type="email" className="w-full border p-2 rounded" placeholder="Email" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Notify Me</button>
              <button type="button" onClick={() => setShowNotifyForm(false)} className="text-gray-500 text-sm mt-2 hover:underline">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
