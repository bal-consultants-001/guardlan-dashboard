'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const subscriptionAdded = searchParams.get('subscriptionAdded') === 'true'
  const [loading, setLoading] = useState(false)

	const handleSubscribe = async () => {
	  setLoading(true)
	  try {
		const res = await fetch('/api/subscription', { method: 'POST' })

		if (!res.ok) {
		  throw new Error('Network response was not ok')
		}

		let data = null
		try {
		  data = await res.json()
		} catch (e) {
		  console.warn('No JSON response returned from /api/subscription', e)
		}

		if (data?.url) {
		  router.push(data.url)
		} else {
		  alert('Failed to create subscription checkout session')
		  setLoading(false)
		}
	  } catch (err) {
		console.error(err)
		alert('Something went wrong.')
		setLoading(false)
	  }
	}


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
		<section className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-7/10 items-center text-center">
			<div className="max-w-xl mx-auto p-4 text-center">
			  {subscriptionAdded ? (
				<>
				  <h1 className="text-2xl font-bold mb-4">Thank you for selecting the monthly support subscription.</h1>
				  <p className="mb-4">
					This is a recurring payment. Please fill in your details below. You can use the same payment details as before.
				  </p>
				  <button
					onClick={handleSubscribe}
					disabled={loading}
					className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
				  >
					{loading ? 'Redirecting...' : 'Proceed to Subscription Payment'}
				  </button>
				  <button
					className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
					onClick={() => router.push('/')}
				  >
					Cancel
				  </button>
				</>
			  ) : (
				<>
				  <h1 className="text-2xl font-bold mb-4">Would you like to add a monthly support subscription?</h1>
				  <p className="mb-4">You can add a subscription for ongoing support and updates.</p>
				  <button
					onClick={handleSubscribe}
					disabled={loading}
					className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mr-4"
				  >
					{loading ? 'Redirecting...' : 'Yes, add subscription'}
				  </button>
				  <button
					onClick={() => router.push('/final-thank-you')}
					disabled={loading}
					className="bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500"
				  >
					No, thanks
				  </button>
				</>
			  )}
			</div>
	      </section>
    </main>
  )
}
