// src/app/verify/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (seconds === 0) {
      router.push('/login')
      return
    }

    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds, router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Please verify your email:
        </h1>
        <p className="mb-4">
          Thank you for registering. You will be able to log in once you have verified your email
          address. You will automatically be redirected to the Login page in{' '}
          <span className="font-semibold">{seconds}</span> second{seconds !== 1 && 's'}...
        </p>
        <button
          onClick={() => router.push('/login')}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Go to Login Now
        </button>
      </section>
    </main>
  )
}
