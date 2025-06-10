'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

type Props = {
  user: any
  cart: any[]
  startStripeCheckout: () => void
}

export default function CheckoutRedirectTrigger({ user, cart, startStripeCheckout }: Props) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkoutRequested = searchParams.get('checkout') === 'true'
    if (checkoutRequested && user && cart.length > 0) {
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      startStripeCheckout()
    }
  }, [searchParams, user, cart, startStripeCheckout])

  return null
}
