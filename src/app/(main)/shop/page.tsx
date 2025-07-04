//shop

'use client'

import { useEffect, useState, useRef } from 'react'
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  const closeGallery = () => setIsGalleryOpen(false)
  const showNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % adblockerImages.length)
  const showPrevImage = () => setCurrentImageIndex((prev) => (prev - 1 + adblockerImages.length) % adblockerImages.length)
  
    // Auto-cycle every 5 seconds (or adjust time as you like)
	useEffect(() => {
	  if (isPaused) return

	  const interval = setInterval(() => {
		setCurrentImageIndex((prev) => (prev + 1) % adblockerImages.length)
	  }, 6000)

	  return () => clearInterval(interval)
	}, [isPaused, adblockerImages.length])

  
    // When user clicks a thumbnail
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
    setIsPaused(true)

    // Clear any existing timeout so it restarts
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)

    // Resume cycling after 30 seconds
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 30000)
  }

  // Remember to clean up on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    }
  }, [])

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
      <section className="py-8 px-4 text-center bg-white">
        <h1 className="text-4xl font-bold mb-4">Shop Products</h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Our Ad & Content filter secures your whole network from intrusive ads and trackers.
        </p>
      </section>

	  {/* Divider */}
			<div className="flex justify-center">
				<span className="w-8/9 mx-auto h-px bg-[var(--color-blue2)] block" />
			</div>

      {/* Postcode Check */}
      <section className="p-6 bg-gray-50 text-center">
        <h2 className="text-xl font-semibold mb-2">Is our service available in your area?</h2>
		<p className="text-lg mb-4">
		  Before purchase one of our devices, please use the Postcode checker to confirm we are operating in your area.
		</p>
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
      <section className="bg-[var(--color-blue2)] text-white py-20">
        <div className="bg-black/40 rounded-xl max-w-5xl mx-auto p-10 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Home Network AdBlocker</h2>
            <p className="text-lg mb-4">Block ads, trackers, and unwanted content across every device on your home network.</p>
            <p className="text-2xl font-semibold">£75 (one-time)</p>
          </div>

          {/* Main Large Image */}
		  <div className="mb-8 flex justify-center">
			<div className="relative w-full max-w-4xl aspect-[16/9] rounded overflow-hidden shadow-lg border-4 border-blue-500">
			  <Image
				src={adblockerImages[currentImageIndex]}
				alt={`AdBlocker ${currentImageIndex + 1}`}
				fill
				className="object-cover"
				priority
			  />
			</div>
		  </div>

		  {/* Gallery Thumbnails */}
		  <div className="flex justify-center gap-4 flex-wrap py-4">
			{adblockerImages.map((src, i) => {
			  const isSelected = i === currentImageIndex
			  return (
				<div
				  key={i}
				  onClick={() => handleThumbnailClick(i)}
				  className={`relative w-48 h-27 rounded overflow-hidden cursor-pointer border-8 transition-all duration-300
					${isSelected ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}
				  `}
				>
				  <Image
					src={src}
					alt={`Thumbnail ${i + 1}`}
					fill
					className="object-cover"
					priority={isSelected}
				  />
				</div>
			  )
			})}
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
