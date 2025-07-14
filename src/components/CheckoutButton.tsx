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

	const {
	  data: { session },
	  } = await supabase.auth.getSession()

	  if (!session) {
		console.error('❌ No Supabase session found on client — user not authenticated')
		return
	  }
    startTransition(async () => {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
		credentials: 'include',
        body: JSON.stringify({ cart }),
      })

      const data = await response.json()

      if (data?.url) {
        router.push(data.url)
      } else {
        console.error('Failed to get checkout URL:', data)
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
