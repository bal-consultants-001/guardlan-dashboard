import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('🔴 Supabase auth error:', authError.message)
    }

    if (!user) {
      console.warn('🟡 No user found in Supabase auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    console.log('✅ Authenticated user:', userId)

    const body = await req.json()
    console.log('🛒 Cart request body:', body)

    const { cart }: { cart: CartItem[] } = body

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${req.nextUrl.origin}/checkout-success?subscriptionAdded=${hasSubscription}`,
      cancel_url: `${req.nextUrl.origin}/shop`,
      metadata: {
        supabaseUserId: userId,
      },
    })

    console.log('✅ Stripe checkout session created:', session.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('❌ Stripe checkout error:', err)
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 })
  }
}
