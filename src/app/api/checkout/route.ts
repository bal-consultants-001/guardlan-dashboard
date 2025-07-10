import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

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
    const { cart }: { cart: CartItem[] } = await req.json()

    const oneTimeItems: CartItem[] = []
    let hasSubscription = false

    // Validate price types directly from Stripe
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
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 })
  }
}
