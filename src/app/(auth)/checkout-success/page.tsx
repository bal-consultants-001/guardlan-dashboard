import { Suspense } from 'react'
import CheckoutSuccessClient from './CheckoutSuccessClient'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
