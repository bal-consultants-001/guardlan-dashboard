'use client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useTransition } from 'react'
import { supabase } from '@/lib/supabase' // Make sure this is your client-side Supabase client

export function CheckoutButton() {
  const { cart } = useCart()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleCheckout = async () => {
    startTransition(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const userId = session?.user?.id

        if (!userId) {
          alert('You must be logged in to checkout.')
          router.push('/login')
          return
        }

        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cart, userId }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Checkout failed:', errorData)
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
        console.error('Checkout request failed:', error)
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

export default CheckoutButton
