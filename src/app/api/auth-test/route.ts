// Create this as /app/api/auth-test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing auth...')
    
    const cookieHeader = req.headers.get('cookie')
    console.log('🍪 Cookies:', cookieHeader ? 'Present' : 'Missing')
    
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('🔍 Auth test results:', {
      user: user?.id,
      session: session?.access_token ? 'exists' : 'missing',
      authError: authError?.message,
      sessionError: sessionError?.message
    })
    
    return NextResponse.json({
      authenticated: !!user,
      userId: user?.id,
      hasSession: !!session,
      authError: authError?.message,
      sessionError: sessionError?.message
    })
  } catch (error) {
    console.error('❌ Auth test failed:', error)
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
}