'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <>
      {/* Top Auth Actions Bar */}
		<section className="bg-[var(--color-blue2)] w-full py-4">
		  <div className="flex items-center justify-between px-6">
			{/* Left-aligned Logo */}
			<Image
			  src="/images/bal-it-grayscale.png"
			  alt="BAL-IT"
			  width={100}
			  height={100}
			  className="flex-shrink-0"
			/>

			{/* Right-aligned Links */}
			<div className="flex gap-4 items-center">
			  {user ? (
				<Link href="/dashboard" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
				  Dashboard
				</Link>
			  ) : (
				<>
				  <Link href="/register" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Register</Link>
				  <Link href="/login" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">Login</Link>
				</>
			  )}
			</div>
		  </div>
		</section>

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] bg-black min-h-[500] max-h-[500]">
        <Image src="/images/blockers.png" alt="GuardLAN AdBlocker" fill className="object-cover opacity-10 max-h-[600]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <Image
			  src="/images/bal-it.png"
			  alt="BAL-IT"
			  width={400}
			  height={400}
			  className="flex-shrink-0 py-8 w-[90%]h-[90%]"
			/>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <div>
		  <Link href="/about" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
            About Us
          </Link>
		  </div>
		  <div>
		  <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
            Shop Now
          </Link>
		  </div>
		</div>
        </div>
      </section>

      {/* Product Showcase Flow */}
      <section className="bg-[var(--color-blue2)] text-white">
        {/* Scene 1: Core Value */}
		<h2 className="font-bold mb-4 text-center py-8">Blocking Adverts and unwanted content across all your devices, no software needed!</h2>
		<div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-20 px-6 h-full space-y-24 rounded-t-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
          <Image src="/images/AdBlocker1.png" alt="Network Filtering" width={500} height={300} className="rounded-lg object-cover" />
          <div>
            <h2 className="text-3xl font-bold mb-4">Ad-Free Browsing on All Devices</h2>
            <p>
              From phones to smart devices, block intrusive ads, pop-ups, and unwanted content at the router level — no extra software required.
              Enhance your browsing speed, battery life, and peace of mind.
            </p>
          </div>
        </div>

        {/* Scene 2: Parental & Privacy */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-6xl mx-auto">
          <Image src="/images/AdBlocker2.png" alt="Family Protection" width={500} height={300} className="rounded-lg object-cover" />
          <div>
            <h2 className="text-3xl font-bold mb-4">Protect What Matters</h2>
            <p>
              Block adult content, gambling sites, and social media distractions. Set boundaries for your kids — or yourself —
			  with customizable filtering profiles tailored to your household&#39;s needs.
			  With GuardLAN, technology becomes a safer space — not something to fear. Empower your family to explore, learn, and connect online with confidence, knowing harmful content is kept out.
			  Create healthy digital habits while preserving privacy and peace of mind.
            </p>
          </div>
        </div>

        {/* Scene 3: Easy Setup & Integration */}
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
          <Image src="/images/AdBlocker5.png" alt="Easy Installation" width={500} height={300} className="rounded-lg object-cover" />
          <div>
            <h2 className="text-3xl font-bold mb-4">Setup & Go Simplicity</h2>
            <p>
              Installation is fully handled by our team — no technical experience required. Once connected to your router, your GuardLAN AdBlocker begins protecting your entire network instantly.
			  The device is compact and unobtrusive, designed to fit seamlessly into any home environment. It&#39;s quiet, energy-efficient, and made using durable, environmentally responsible materials — because protecting your family shouldn&#39;t come at the planet&#39;s expense.
			  With every installation, you get peace of mind and a 30-day parts guarantee as standard. Safe, sustainable, and built with families in mind.
            </p>
          </div>
        </div>
		
		{/* Scene 4: Before & After Example */}
		<div className="max-w-6xl mx-auto text-center space-y-6">
		  <h2 className="text-3xl font-bold">See the Difference</h2>
		  <p className="mb-8">Here’s a real example of the web experience with and without GuardLAN’s ad blocking in action.</p>
		  
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
			{/* AdBlocker OFF */}
			<div>
			  <Image
				src="/images/AdBlocker-off.png"
				alt="With Ads (AdBlocker Off)"
				width={600}
				height={400}
				className="rounded-lg shadow-lg object-cover"
			  />
			  <p className="mt-2 text-lg font-semibold text-red-300">Without GuardLAN (Ads Active)</p>
			</div>

			{/* AdBlocker ON */}
			<div>
			  <Image
				src="/images/AdBlocker-on.png"
				alt="Ad-Free (AdBlocker On)"
				width={600}
				height={400}
				className="rounded-lg shadow-lg object-cover"
			  />
			  <p className="mt-2 text-lg font-semibold text-green-300">With GuardLAN (Ads Blocked)</p>
			</div>
		  </div>
		</div>

		</div>
      </section>

      {/* Subscription Plan */}
      <section className="bg-gray-100">
	  <div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-20 px-6 h-full space-y-24 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <Image src="/images/subscription1.jpg" alt="Monthly Subscription" width={800} height={300} className="mx-auto rounded-lg mb-8 object-cover" />
          <h2 className="text-3xl font-bold mb-4">Monthly Subscription & Insights</h2>
          <p className="mb-4">
            Keep your GuardLAN AdBlocker up-to-date with the latest filters, security patches, and performance tweaks. Monitor what’s being blocked and get personalized reports.
          </p>
          <p className="mb-6">
            Enjoy a free remote support session each month, and manage everything through your online dashboard.
          </p>
          <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
            Subscribe
          </Link>
        </div>
		</div>
      </section>

      {/* Hourly Support */}
      <section className="bg-[var(--color-blue2)] text-white">
	  <div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-20 px-6 h-full space-y-24 rounded-b-lg shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <Image src="/images/support.jpg" alt="Support & Training" width={800} height={300} className="mx-auto rounded-lg mb-8 object-cover" />
          <h2 className="text-3xl font-bold mb-4">On-Demand Support & Training</h2>
          <p className="mb-4">
            Need help? Book hourly sessions for in-home troubleshooting, custom setup, or even training for your household.
          </p>
          <p className="mb-6">
            We&#39;re here to ensure your AdBlocker is running smoothly — and you know exactly how to get the most from it.
          </p>
          <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Book Support
          </Link>
        </div>
		</div>
      </section>
    </>
  );
}
