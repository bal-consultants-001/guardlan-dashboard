// app/api/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

type CartItem = {
  id: number
  name: string
  price: string
  priceAmount: number
  description: string
  quantity: number
  stripePriceId: string
  isSubscriptionAddon?: boolean // <-- mark subscription addon items
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(req: NextRequest) {
  try {
    const { cart }: { cart: CartItem[] } = await req.json()

    // Create line_items for one-time purchase only
    // Filter out subscription add-ons (subscriptions can't be in payment mode)
    const oneTimeItems = cart.filter(item => !item.isSubscriptionAddon)

    if (oneTimeItems.length === 0) {
      // If no one-time items, skip this checkout step and go directly to subscription
      return NextResponse.json({ redirectToSubscription: true })
    }

    const line_items = oneTimeItems.map(item => ({
      price: item.stripePriceId,
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${req.nextUrl.origin}/checkout-success?subscriptionAdded=${cart.some(i => i.isSubscriptionAddon)}`,
      cancel_url: `${req.nextUrl.origin}/shop`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 })
  }
}
