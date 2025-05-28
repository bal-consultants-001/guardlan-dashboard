//admin

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      const role = user.user_metadata?.role
      if (role === 'admin') {
        setAuthorized(true)
      } else {
        router.push('/') // not allowed
      }
    }

    checkAdmin()
  }, [router])

  if (!authorized) return <p>Loading...</p>

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* Display ticket management etc. here */}
    </main>
  )
}
