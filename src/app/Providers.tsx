// app/providers.tsx
'use client'

import { PropsWithChildren, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { SessionContextProvider } from '@supabase/auth-helpers-react' // STILL USED INTERNALLY

export function Providers({ children }: PropsWithChildren) {
  const [supabaseClient] = useState(() => createClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
