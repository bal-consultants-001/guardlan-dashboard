//complete-profile page

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
	const support = 'false'

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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<section className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
	  <p className="mb-6 text-center">
	  <em className="text-16px]">As part of our delivery, installation and support process we need to confirm certain details.
	  Please fill in the fields below to complete your profile setup, thank you.</em>
	  </p>
      {Object.keys(formData).map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={formData[field as keyof typeof formData]}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />
      ))}
	  <div className="flex flex-col space-y-2">
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Saving...' : 'Submit'}
      </button>
	  <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={() => router.push('/')}
          >
            Cancel
          </button>
	  </div>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
	  </section>
    </main>
  )
}
