//login page

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setMessage(`Error: ${signInError.message}`)
      console.error(signInError)
      return
    }

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setMessage('Failed to get user information.')
      return
    }

    // Check if email is confirmed
    if (!user.email_confirmed_at) {
      setMessage('Please verify your email before continuing.')
      return
    }

    // Check if Firstname and Lastname are populated in the Owners table
    const { data: ownerData, error: ownerError } = await supabase
      .from('owner')
      .select('Firstname,Lastname')
      .eq('ID', user.id)
      .single()

    if (ownerError) {
      setMessage(`Error fetching profile: ${ownerError.message}`)
      return
    }

    const { Firstname, Lastname } = ownerData

    if (!Firstname || !Lastname) {
      // Redirect to profile completion page
      router.push('/complete-profile')
    } else {
		
	  const checkoutIntent = localStorage.getItem('checkoutIntent')

	  if (checkoutIntent === 'true') {
		localStorage.removeItem('checkoutIntent')
		router.push('/shop?checkout=true') // Go back to Shop to auto-trigger checkout
	  } else {
		  // Profile complete, go to dashboard
		  router.push('/dashboard')
    }
  }
}

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        className="border p-2 w-full mb-4"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-800"
        onClick={handleLogin}
      >
        Sign In
      </button>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </main>
  );
}
