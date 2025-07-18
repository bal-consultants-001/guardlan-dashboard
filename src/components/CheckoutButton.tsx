'use client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useTransition } from 'react'
import { supabase } from '@/lib/supabase';

export function CheckoutButton() {
  const { cart } = useCart()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const session = await supabase.auth.getSession(); // get access token
  const accessToken = session.data?.session?.access_token;

  const handleCheckout = async () => {
    startTransition(async () => {
      try {
        // Don't handle auth on client - let server handle it entirely
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // This ensures cookies are sent
          body: JSON.stringify({ cart }),
        })

        console.log('📡 Response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Checkout failed:', errorData)
          
          // Handle specific auth errors
          if (response.status === 401) {
            alert('Please log in to continue with checkout')
            // Optionally redirect to login page
            // router.push('/login')
          } else {
            alert(`Checkout failed: ${errorData.error || 'Unknown error'}`)
          }
          return
        }

        const data = await response.json()
        if (data?.url) {
          router.push(data.url)
        } else {
          console.error('Failed to get checkout URL:', data)
          alert('Failed to get checkout URL')
        }
		
		const response = await fetch('/api/checkout', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`, // ⬅️ pass token manually
		  },
		body: JSON.stringify({ cart }),
		});
		
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