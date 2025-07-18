// app/api/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

type CartItem = {
  id: number
  name: string
  price: string
  priceAmount: number
  description: string
  quantity: number
  stripePriceId: string
  isSubscriptionAddon?: boolean
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

// Admin Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role, only for backend
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cart, userId }: { cart: CartItem[]; userId: string } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    // Get user details from 'owner' table
    const { data: ownerData, error: ownerError } = await supabaseAdmin
      .from('owner')
      .select('Email, Fullname, stripe_customer_id')
      .eq('ID', userId)
      .single()

    if (ownerError || !ownerData) {
      console.error('Error fetching user from DB:', ownerError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const oneTimeItems: CartItem[] = []
    let hasSubscription = false

    for (const item of cart) {
      const price = await stripe.prices.retrieve(item.stripePriceId)
      if (price.recurring) {
        hasSubscription = true
      } else {
        oneTimeItems.push(item)
      }
    }

    if (oneTimeItems.length === 0) {
      return NextResponse.json({ redirectToSubscription: true })
    }

    const line_items = oneTimeItems.map(item => ({
      price: item.stripePriceId,
      quantity: item.quantity,
    }))

    // Get or create Stripe customer
    let customerId = ownerData.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: ownerData.Email,
        name: ownerData.Fullname,
        metadata: {
          supabaseUserId: userId,
        },
      })

      customerId = customer.id

      // Save new Stripe customer ID to Supabase
      await supabaseAdmin
        .from('owner')
        .update({ stripe_customer_id: customerId })
        .eq('ID', userId)
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer: customerId,
      success_url: `${req.nextUrl.origin}/checkout-success?subscriptionAdded=${hasSubscription}`,
      cancel_url: `${req.nextUrl.origin}/shop`,
      metadata: {
        supabaseUserId: userId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 })
  }
}
