'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const subscriptionAdded = searchParams.get('subscriptionAdded') === 'true'

  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    const res = await fetch('/api/subscribe', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      router.push(data.url)
    } else {
      alert('Failed to create subscription checkout session')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      {subscriptionAdded ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Thank you for selecting the monthly support subscription.</h1>
          <p className="mb-4">This is a recurring payment. Please fill in your details below. You can use the same payment details as before.</p>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            {loading ? 'Redirecting...' : 'Proceed to Subscription Payment'}
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
  )
}
