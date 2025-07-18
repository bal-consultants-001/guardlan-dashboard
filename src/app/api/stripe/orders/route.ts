// app/api/stripe/orders/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase';

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
    // 1. Fetch latest Stripe charges
    const charges = await stripe.charges.list({
      customer,
      limit: 10,
    })

    const stripeOrders = charges.data.map((charge) => ({
      id: charge.id,
      amount: (charge.amount / 100).toFixed(2),
      currency: charge.currency,
      status: charge.status,
      created: new Date(charge.created * 1000).toLocaleDateString(),
      description: charge.description,
    }))

    const stripeIds = stripeOrders.map((c) => c.id)

    // 2. Connect to Supabase
    const supabase = supabase()

    // 3. Fetch existing Supabase orders
    const { data: existingOrders, error: supaError } = await supabase
      .from('ord')
      .select('stripe_ord')
      .in('stripe_ord', stripeIds)

    if (supaError) throw supaError

    const existingStripeIds = new Set(existingOrders?.map((o) => o.stripe_ord))

    // 4. Filter Stripe ord not yet in Supabase
    const missingOrders = stripeOrders.filter(
      (order) => !existingStripeIds.has(order.id)
    )

    // 5. Insert missing orders into Supabase
    if (missingOrders.length > 0) {
      const insertPayload = missingOrders.map((order) => ({
        stripe_ord: order.id,
        note: '', // optional
        status: 1, // default status, e.g., 1 = "Pending"
      }))

      const { error: insertError } = await supabase
        .from('ord')
        .insert(insertPayload)

      if (insertError) throw insertError
    }

    // 6. Fetch enriched orders (from the view)
    const { data: enrichedOrders, error: viewError } = await supabase
      .from('orders_with_status')
      .select('*')
      .in('stripe_ord', stripeIds)

    if (viewError) throw viewError

    // 7. Merge and return enriched data
    const merged = stripeOrders.map((s) => {
      const match = enrichedOrders?.find((e) => e.stripe_ord === s.id)
      return {
        items: s.description ?? 'Unknown',
        amount: s.amount,
        status: match?.status_label ?? 'Unknown',
        date: s.created,
        note: match?.note ?? '',
      }
    })

    return NextResponse.json(merged)
  } catch (err) {
    console.error('Order fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch or sync orders' }, { status: 500 })
  }
}
