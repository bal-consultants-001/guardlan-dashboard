// src/app/success/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
	
	localStorage.removeItem('cart')
	
    if (seconds === 0) {
      router.push('/')
      return
    }

    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds, router])

  return (
    <main className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
      <p className="mb-4">
        Thank you for your purchase! Redirecting you to the homepage in{' '}
        <span className="font-semibold">{seconds}</span> second{seconds !== 1 && 's'}...
      </p>
      <button
        onClick={() => router.push('/')}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Go to Home Now
      </button>
    </main>
  )
}
