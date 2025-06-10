'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

type Product = {
  id: number
  name: string
  price: string
  priceAmount: number
  description: string
}

type CartItem = Product & { quantity: number }

type Props = {
  user: User | null
  cart: CartItem[]
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
