'use client'

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Example Product' },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
      }),
    })

    const { sessionId } = await res.json()
    const stripe = await stripePromise
    await stripe?.redirectToCheckout({ sessionId })
  }

  return (
    <button onClick={handleCheckout} className="bg-blue-600 text-white p-2 rounded">
      Checkout with Stripe
    </button>
  )
}
