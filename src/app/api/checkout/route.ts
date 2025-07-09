// app/api/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(req: NextRequest) {
  const { productPriceId, subscriptionPriceId, includeSubscription } = await req.json()

  const line_items = [
    { price: productPriceId, quantity: 1 },
    ...(includeSubscription ? [{ price: subscriptionPriceId, quantity: 1 }] : []),
  ]

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: includeSubscription ? 'subscription' : 'payment',
      line_items,
      success_url: `${req.nextUrl.origin}/success`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal error' }, { status: 500 })
  }
}