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
  try {
    // Initialize supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Try to get the authorization header first
    const authHeader = req.headers.get('authorization')
    let user
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Use the token from the Authorization header
      const token = authHeader.substring(7)
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token)
      
      if (tokenError) {
        console.error('🔴 Token auth error:', tokenError.message)
      } else {
        user = tokenUser
      }
    }
    
    // Fallback to cookie-based auth if token auth didn't work
    if (!user) {
      const { data: { user: cookieUser }, error: cookieError } = await supabase.auth.getUser()
      
      if (cookieError) {
        console.error('🔴 Cookie auth error:', cookieError.message)
      } else {
        user = cookieUser
      }
    }

    if (!user) {
      console.warn('🟡 No user found in Supabase auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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