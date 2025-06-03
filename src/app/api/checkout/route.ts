// app/api/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '"2025-05-28.basil"',
})

export async function POST(req: NextRequest) {
  const { items } = await req.json()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items,
      success_url: `${req.nextUrl.origin}/success`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
	  if (err instanceof Error) {
		return NextResponse.json({ error: err.message }, { status: 500 })
	  }
	  return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
	}

    return NextResponse.json({ error: err.message }, { status: 500 })
  }
