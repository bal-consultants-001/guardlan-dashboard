'use client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext' // adjust import as needed
import { useTransition } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export function CheckoutButton() {
  const { cart } = useCart()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleCheckout = async () => {
    const supabase = createPagesBrowserClient()
    
    // First check if we have a user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('🔍 User check:', { user: user?.id, error: userError })
    
    // Then check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('🔍 Session check:', { 
      session: session?.access_token ? 'exists' : 'missing', 
      error: sessionError,
      user: session?.user?.id 
    })
    
    if (!session || !user) {
      console.error('❌ No valid session/user found')
      // Try to redirect to login or show error
      alert('Please log in to continue with checkout')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Pass the access token in the Authorization header
            'Authorization': `Bearer ${session.access_token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ cart }),
        })

        console.log('📡 Response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Checkout failed:', errorData)
          alert(`Checkout failed: ${errorData.error || 'Unknown error'}`)
          return
        }

        const data = await response.json()
        if (data?.url) {
          router.push(data.url)
        } else {
          console.error('Failed to get checkout URL:', data)
          alert('Failed to get checkout URL')
        }
      } catch (error) {
        console.error('❌ Checkout request failed:', error)
        alert('Network error during checkout')
      }
    })
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isPending || cart.length === 0}
      className="checkout-button block mt-4 bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 w-full"
    >
      {isPending ? 'Loading...' : 'Checkout'}
    </button>
  )
}

export default CheckoutButton;