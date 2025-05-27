'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    Firstname: '',
    Lastname: '',
    Address1: '',
    Address2: '',
    County: '',
    Postcode: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    const { supabase } = await import('@/lib/supabase')
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setMessage('You must be logged in to complete your profile.')
      setLoading(false)
      return
    }
	
	const email = user.email
	const support = FALSE

    const {
      Firstname,
      Lastname,
      Address1,
      Address2,
      County,
      Postcode,
    } = formData

    const { error } = await supabase
      .from('owner')
      .upsert(
        {
          ID: user.id,
		  Email: email,
          Firstname,
          Lastname,
          Fullname: `${Firstname} ${Lastname}`,
          Address1,
          Address2,
          County,
          Postcode,
		  Support: support,
        },
        { onConflict: 'ID' } // assumes 'id' is the primary key or unique constraint
      )

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Profile updated!')
      router.push('/dashboard') // or wherever your app should go
    }

    setLoading(false)
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      {Object.keys(formData).map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={formData[field as keyof typeof formData]}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
      ))}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Saving...' : 'Submit'}
      </button>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </main>
  )
}
