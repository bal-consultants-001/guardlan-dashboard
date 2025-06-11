//home page

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import Layout from '@/components/Layout'
import Image from "next/image";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
	
  }, [])

  return (
    <Layout>
      <section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full py-4 overflow-hidden">
		  <div className="flex justify-end gap-4 px-6">
			{user ? (
			  <Link
                href="/dashboard"
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
				
				  Dashboard
				
			  </Link>
			) : (
			  <>
				<Link
                  href="/register"
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
				  
					Register
				  
				</Link>
				<Link
                  href="/login"
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
				  
					Login
				  
				</Link>
			  </>
			)}
		  </div>
	  </section>
      <section className="bg-white w-full">
		  <div className="py-20 flex justify-center">
			<div className="flex flex-col items-center max-w-2x1 text-center">
				<h1 className="text-5xl font-bold mb-4">Protect Your Home from Ads</h1>
				<p className="text-lg mb-4">
				  Our hardware AdBlocker GuardLAN secures your whole network from intrusive ads and trackers.
				</p>
				<Link
                  href="/shop"
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
				  
					Shop Now
				  
				</Link>
			</div>
		  </div>
	  </section>
	  <section className="bg-[linear-gradient(130deg,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full py-0 overflow-hidden">
      <div className="py-10 px-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-white max-w-12xl min-w-[1550] mx-auto">
	  {/*Row 1 */}
        <div className="p-40 shadow-lg rounded-lg border max-h-[550] min-w-[700]">
          <h2 className="relative text-xl font-bold mb-2 -top-20 -left-8">AdBlocker Device</h2>
          <p className="relative -top-8">Take control of your online safety with our professionally installed, whole-home content filtering solution.
		  Designed to block intrusive ads and inappropriate content across all your devices, our AdBlocker creates a safer,
		  cleaner internet experience for you and your family.
		  With seamless integration into your home network, you can enjoy peace of mind knowing your household is protected 24/7.</p>
        </div>
		<div className="flex items-center justify-center relative w-[100%] h-[100%]">
		  <Image
		  src="/images/AdBlocker0.jpg"
		  alt="AdBlocker Device"
		  fill
		  className="rounded-lg object-cover"
		  />
		</div>
	  {/*Row 2 */}
		<div className="flex items-center justify-center relative w-[100%] h-[100%]">
		  <Image
		  src="/images/subscription1.jpg"
		  alt="AdBlocker Device"
		  fill
		  className="rounded-lg object-cover"
		  />
		</div>
        <div className="p-40 shadow-lg rounded-lg border max-h-[550] min-w-[700]">
          <h2 className="relative text-xl font-bold mb-2 -top-20 -right-8 text-right">Monthly Subscription & Insights</h2>
          <p className="relative -top-8 mr-2 text-right">Stay ahead with our powerful monthly subscription.
		  Gain real-time insights into how much unwanted traffic your network filter is blocking,
		  enjoy regular performance and security updates, and receive proactive device support.
		  Subscribers also benefit from one free remote support session every month. Plus, easily manage your filter settings anytime through our intuitive web portal.</p>
        </div>
	  {/*Row 3*/}
        <div className="p-40 shadow-lg rounded-lg border max-h-[550] min-w-[700]">
          <h2 className="relative text-xl font-bold mb-2 -top-20 -left-8">On-Demand Support & Training</h2>
          <p className="relative -top-8">Need hands-on help? Our flexible hourly support service has you covered.
		  Whether it&#39;s diagnosing issues, applying fixes on-site,
		  or offering personalized training for your AdBlocker device,
		  our experts are ready to assist. We’re here to ensure your system runs smoothly, so that you feel confident using it.</p>
        </div>
		<div className="flex items-center justify-center relative w-[100%] h-[100%]">
		  <Image
		  src="/images/background1.jpg"
		  alt="AdBlocker Device"
		  fill
		  className="rounded-lg object-cover"
		  />
		</div>
      </div>
	  </section>
    </Layout>
  );
}
