// app/api/stripe/orders/route.ts (Next.js 13/14)
// or pages/api/stripe/orders.ts (Next.js 12)

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil',
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const customer = searchParams.get('customer')

  if (!customer) {
    return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 })
  }

  try {
    // Get the latest 10 charges for the customer
    const charges = await stripe.charges.list({
      customer,
      limit: 10,
    })

    const orders = charges.data.map((charge) => ({
      id: charge.id,
      amount: (charge.amount / 100).toFixed(2),
      currency: charge.currency,
      status: charge.status,
      created: new Date(charge.created * 1000).toLocaleDateString(),
      description: charge.description,
    }))

    return NextResponse.json(orders)
  } catch (err: unknown) {
  console.error('Stripe fetch error:', err)

  if (err instanceof Error) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
}
}
