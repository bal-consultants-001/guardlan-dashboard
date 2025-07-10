// app/(auth)/checkout-success/page.tsx

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const CheckoutSuccessClient = dynamic(() => import('./CheckoutSuccessClient'), {
  ssr: false,
})

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
