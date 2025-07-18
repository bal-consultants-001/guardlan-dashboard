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
	})

	const stripeOrders = await Promise.all(
	  charges.data.map(async (charge) => {
		let items = 'Unknown item'

		try {
		  // 1. Get the payment intent id from the charge
		  const paymentIntentId = charge.payment_intent as string | undefined

		  if (paymentIntentId) {
			// 2. List all checkout sessions filtered by this payment_intent
			const sessions = await stripe.checkout.sessions.list({
			  payment_intent: paymentIntentId,
			  limit: 1, // usually one session per payment intent
			})

			if (sessions.data.length > 0) {
			  const session = sessions.data[0]

			  // 3. Get the line items for this checkout session
			  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

			  if (lineItems.data.length > 0) {
				items = lineItems.data
				  .map((line) => line.description || line.price?.product || 'Unnamed item')
				  .join(', ')
			  }
			}
		  }
		} catch (error) {
		  console.error(`Failed to fetch line items for charge ${charge.id}:`, error)
		}

		return {
		  id: charge.id,
		  amount: (charge.amount / 100).toFixed(2),
		  currency: charge.currency,
		  status: charge.status,
		  created: new Date(charge.created * 1000).toLocaleDateString(),
		  description: items,
		}
	  })
	)




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
