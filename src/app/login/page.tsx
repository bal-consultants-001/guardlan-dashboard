'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    // ⛔ DO NOT import supabase at the top
    const { supabase } = await import('@/lib/supabase') // ✅ dynamic import
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Logged in successfully.')
	  router.push('/dashboard')
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
	  
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleLogin}>
        Sign In
      </button>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </main>
  )
}