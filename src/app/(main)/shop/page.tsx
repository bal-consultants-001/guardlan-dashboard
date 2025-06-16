//shop

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useCart } from '@/context/CartContext'
import { usePostcode } from '@/context/PostcodeContext';
import Image from 'next/image';

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
  const [user, setUser] = useState<User | null>(null)
  const [postcodeInput, setPostcodeInput] = useState('')
  const { serviceable, setServiceable } = usePostcode();
  const [showNotifyForm, setShowNotifyForm] = useState(false)
  const [subscriptionSelected, setSubscriptionSelected] = useState(false)
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

	const closeGallery = () => {
	  setIsGalleryOpen(false)
	}

	const showNextImage = () => {
	  setCurrentImageIndex((prev) => (prev + 1) % adblockerImages.length)
	}

	const showPrevImage = () => {
	  setCurrentImageIndex((prev) => (prev - 1 + adblockerImages.length) % adblockerImages.length)
	}


  return (
	<>
      {/* Auth Actions */}
      <section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full py-4">
		  <div className="flex items-center justify-between px-6">
			{/* Left-aligned Logo */}
			<Image
			  src="/images/logo-no-background.png"
			  alt="BAL-IT"
			  width={100}
			  height={100}
			  className="flex-shrink-0"
			/>

			{/* Right-aligned Links */}
			<div className="flex gap-4 items-center">
          {user ? (
		  <>
            <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Home</Link>
			<Link href="/dashboard" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Dashboard</Link>
			</>
          ) : (
            <>
              <Link href="/register" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Register</Link>
              <Link href="/login" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Login</Link>
            </>
          )}
          </div>
		</div>
      </section>

      {/* Intro */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Shop Products</h1>
        <p className="mb-6 text-lg">
          Our hardware AdBlocker GuardLAN secures your whole network from intrusive ads and trackers.
        </p>
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
      {/* Featured Product: Home Network AdBlocker */}
		<section id="products" className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] text-white w-full">
		<div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-20 px-6 h-full space-y-24 rounded-t-lg shadow-lg">
		  <div className="max-w-3xl mx-auto text-center">
			<h2 className="text-3xl font-bold mb-4">Home Network AdBlocker</h2>
			<p className="text-lg mb-6">
			  Block ads, trackers, and unwanted content across every device on your home network. Enjoy a cleaner, faster, and safer internet experience.
			</p>
			<p className="text-2xl font-semibold mb-4">£75 (one-time)</p>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
			  {adblockerImages.map((src, index) => (
				<div
				  key={index}
				  className="w-full aspect-[16/9] overflow-hidden rounded shadow cursor-pointer"
				  onClick={() => openGallery(index)}
				>
				  <Image src={src} alt={`AdBlocker preview ${index + 1}`} className="w-full h-full object-cover transition hover:opacity-80"/>
				</div>
			  ))}
			</div>
			
			<div className="text-left bg-gray-100 p-6 rounded mb-6 text-black">
			  <h3 className="text-lg font-bold mb-2">Optional Add-on:</h3>
			  <label className="flex items-center gap-2">
				<input
				  type="checkbox"
				  checked={subscriptionSelected}
				  onChange={() => setSubscriptionSelected(!subscriptionSelected)}
				/>
				<span>
				  <strong>Monthly Subscription (£6/month)</strong> — Includes proactive support, automatic updates, and content filtering reports.
				</span>
			  </label>
			</div>

			<button
			  className="btn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
			  onClick={() => {
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
			  }}
			>
			  Add to Cart
			</button>
		  </div>
		  </div>
		</section>
		
		{isGalleryOpen && (
		  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/40">
			<button
			  className="absolute top-6 right-6 text-white text-3xl font-bold"
			  onClick={closeGallery}
			>
			  &times;
			</button>

			<button
			  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
			  onClick={showPrevImage}
			>
			  &#10094;
			</button>

			<Image src={adblockerImages[currentImageIndex]} alt="Expanded AdBlocker" className="max-w-[90vw] max-h-[80vh] rounded shadow-xl"/>

			<button
			  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
			  onClick={showNextImage}
			>
			  &#10095;
			</button>
		  </div>
		)}
		
		{/* Hourly Support Section */}
		<section className="bg-gray-100 py-12 px-4 text-black text-center">
		  <div className="max-w-2xl mx-auto">
			<h2 className="text-2xl font-bold mb-4">Hourly Support</h2>
			<p className="text-lg mb-2">Need extra help or training?</p>
			<p className="text-xl font-semibold mb-4">£25/hr (Invoiced)</p>
			<p className="mb-6">Technical assistance, remote troubleshooting, or custom configurations — charged per hour, billed after service.</p>
			<Link href="/contact" className="btn bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
			  Contact Us
			</Link>
		  </div>
		</section>
	</>
  )
}
