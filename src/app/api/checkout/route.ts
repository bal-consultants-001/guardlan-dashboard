import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js';

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      headers: {
        Authorization: req.headers.get('Authorization') ?? '',
      },
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Starting checkout request...')
    
    // Log cookies for debugging
    const cookieHeader = req.headers.get('cookie')
    console.log('🍪 Cookies present:', cookieHeader ? 'Yes' : 'No')
    
    // Use only server-side session management
    const supabase = createRouteHandlerClient({ cookies })
    
    console.log('🔍 Getting user from Supabase...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('🔍 Auth result:', { 
      user: user?.id, 
      error: authError?.message,
      hasUser: !!user 
    })
    
    if (authError) {
      console.error('🔴 Supabase auth error:', authError.message)
      return NextResponse.json({ error: 'Authentication failed', details: authError.message }, { status: 401 })
    }

    if (!user) {
      console.warn('🟡 No user found in Supabase auth')
      return NextResponse.json({ error: 'Unauthorized - no user found' }, { status: 401 })
    }

    const userId = user.id
    console.log('✅ Authenticated user:', userId)

    // Get user details from owners table for customer creation
    const { data: ownerData, error: ownerError } = await supabase
      .from('owner')
      .select('Email, Fullname, stripe_customer_id')
      .eq('ID', userId)
      .single()

    if (ownerError) {
      console.error('❌ Failed to fetch owner data:', ownerError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

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

    // Create or retrieve Stripe customer
    let customerId = ownerData.stripe_customer_id

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: ownerData.Email,
        name: ownerData.Fullname,
        metadata: {
          supabaseUserId: userId,
        },
      })
      customerId = customer.id
      console.log('✅ Created new Stripe customer:', customerId)
    } else {
      console.log('✅ Using existing Stripe customer:', customerId)
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer: customerId, // Use the customer ID
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