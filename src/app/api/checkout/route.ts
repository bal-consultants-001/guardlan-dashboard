import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
  }

  const userId = user.id

  try {
    const { cart }: { cart: CartItem[] } = await req.json()

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
        supabaseUserId: userId, // 👈 now works
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 })
  }
}
