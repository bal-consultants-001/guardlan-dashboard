// route.ts — returns all Stripe orders + matching Supabase metadata

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function GET() {
  try {
    // 1. Get Stripe charges
    const charges = await stripe.charges.list({ limit: 100 })

    // 2. For each charge, get session + line items + supabase status
    const orders = await Promise.all(
      charges.data.map(async (charge) => {
        let items = 'Unknown item'

        if (charge.payment_intent) {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: charge.payment_intent as string,
            limit: 1,
          })

          if (sessions.data.length > 0) {
            const session = sessions.data[0]
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
            items = lineItems.data.map(item => item.description || item.price?.id).join(', ')
          }
        }

        // 3. Look up extra order info in Supabase (match by Stripe charge ID or email)
        const { data: supaOrder } = await supabase
          .from('orders_with_status')
          .select('*')
          .eq('stripe_ord', charge.id)
          .single()

        return {
          id: charge.id,
          email: charge.billing_details.email,
          amount: (charge.amount / 100).toFixed(2),
          currency: charge.currency,
          created: new Date(charge.created * 1000).toLocaleString(),
          items,
          supabaseStatus: supaOrder?.status_label ?? 'unknown',
        }
      })
    )

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Admin orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
