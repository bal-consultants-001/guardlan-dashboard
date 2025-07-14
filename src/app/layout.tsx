import type { Metadata } from 'next'
import { Geist, Geist_Mono, Oswald } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { PostcodeProvider } from '@/context/PostcodeContext'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Providers } from './providers'
import 'leaflet/dist/leaflet.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const oswald = Oswald({ weight: ['500', '700'], subsets: ['latin'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: 'GuardLAN Store',
  description: 'Network security hardware and support.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    { cookies }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>
          <CartProvider>
            <PostcodeProvider>{children}</PostcodeProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  )
}
