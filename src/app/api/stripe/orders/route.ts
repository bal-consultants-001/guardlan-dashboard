// app/api/stripe/orders/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

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
	  expand: ['data.invoice'],
    })

	const stripeOrders = charges.data.map((charge) => {
	  const invoice = charge.invoice as Stripe.Invoice | null;

	  const items = invoice?.lines?.data.map(line => line.description).join(', ');

	  return {
		id: charge.id,
		amount: (charge.amount / 100).toFixed(2),
		currency: charge.currency,
		status: charge.status,
		created: new Date(charge.created * 1000).toLocaleDateString(),
		description: items || charge.description || 'Unknown item',
	  };
	});

	charges.data.forEach((charge, i) => {
      console.log(`\n🔎 Charge ${i + 1}:\n`, JSON.stringify(charge, null, 2))
	})

    const stripeIds = stripeOrders.map((c) => c.id)

    // 2. Check for existing records in Supabase
    const { data: existingOrders, error: supaError } = await supabase
      .from('ord')
      .select('stripe_ord')
      .in('stripe_ord', stripeIds)

    if (supaError) throw supaError

    const existingStripeIds = new Set(existingOrders?.map((o) => o.stripe_ord))

    // 3. Insert missing orders into Supabase
    const missingOrders = stripeOrders.filter(
      (order) => !existingStripeIds.has(order.id)
    )

    if (missingOrders.length > 0) {
      const insertPayload = missingOrders.map((order) => ({
        stripe_ord: order.id,
        note: '',
        status: 1, // default to Pending
      }))

      const { error: insertError } = await supabase
        .from('ord')
        .insert(insertPayload)

      if (insertError) throw insertError
    }

    // 4. Fetch enriched order data from view
    const { data: enrichedOrders, error: viewError } = await supabase
      .from('orders_with_status')
      .select('*')
      .in('stripe_ord', stripeIds)

    if (viewError) throw viewError

    // 5. Merge Stripe & Supabase data
    const merged = stripeOrders.map((s) => {
      const match = enrichedOrders?.find((e) => e.stripe_ord === s.id)
      return {
        items: s.description,
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
