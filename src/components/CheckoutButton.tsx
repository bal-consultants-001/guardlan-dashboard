'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/cartContext' // adjust import as needed
import { useTransition } from 'react'

export function CheckoutButton() {
  const { cart } = useCart()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleCheckout = async () => {
    startTransition(async () => {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      className="checkout-button"
    >
      {isPending ? 'Loading...' : 'Checkout'}
    </button>
  )
}
