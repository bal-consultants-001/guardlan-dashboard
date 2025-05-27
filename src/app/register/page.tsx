'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    const { supabase } = await import('@/lib/supabase') // ✅ Lazy load
    const { error } = await supabase.auth.signUp({
      email,
      password,
	  phone,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email to confirm registration.')
	  //router.push('/complete-profile')
	  router.push('/login')
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input
        className="border p-2 w-full mb-4"
        placeholder="Email"
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
	  <input
        type="phone"
        className="border p-2 w-full mb-4"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleRegister}>
        Register
      </button>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </main>
  )
}
