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
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(req: NextRequest) {
  try {
    const { cart }: { cart: CartItem[] } = await req.json()

    const line_items = cart.map((item: CartItem) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.priceAmount * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${req.nextUrl.origin}/success`,
      cancel_url: `${req.nextUrl.origin}/shop`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    // 👇 Strongly typed error logging without `any`
    console.error('Stripe error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 })
  }
}
