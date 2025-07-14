// /app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const customerId = session.customer as string
    const supabaseUserId = session.metadata?.supabaseUserId

    if (!supabaseUserId) {
      console.warn('⚠️ Missing Supabase user ID in metadata')
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    if (!customerId) {
      console.warn('⚠️ Missing customer ID in session')
      return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First check if the customer ID is already set
    const { data: existingOwner, error: fetchError } = await supabase
      .from('owner')
      .select('stripe_customer_id')
      .eq('ID', supabaseUserId)
      .single()

    if (fetchError) {
      console.error('❌ Failed to fetch owner:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch owner' }, { status: 500 })
    }

    // Only update if the customer ID is different (or null)
    if (existingOwner.stripe_customer_id !== customerId) {
      const { error: updateError } = await supabase
        .from('owner')
        .update({ stripe_customer_id: customerId })
        .eq('ID', supabaseUserId)

      if (updateError) {
        console.error('❌ Supabase update failed:', updateError)
        return NextResponse.json({ error: 'Failed to link user' }, { status: 500 })
      }

      console.log(`✅ Updated Stripe customer ${customerId} for Supabase user ${supabaseUserId}`)
    } else {
      console.log(`✅ Customer ${customerId} already linked to Supabase user ${supabaseUserId}`)
    }
  }

  return NextResponse.json({ received: true })
}