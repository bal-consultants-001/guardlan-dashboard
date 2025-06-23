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
		<section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full py-4">
		  <div className="flex items-center justify-between px-6">
			{/* Left-aligned Logo */}
			<Image
			  src="/images/logo-no-background.png"
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
      <section className="relative w-full h-[50vh] bg-white min-h-[400]">
	    <div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-20 px-6 h-full space-y-24 rounded-t-lg shadow-lg">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <Image
			  src="/images/logo-no-background.png"
			  alt="BAL-IT"
			  width={400}
			  height={400}
			  className="flex-shrink-0 py-6 w-[90%]h-[90%]"
			/>
          </div>
		</div>
      </section>

      {/* About us Flow */}
      <section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] text-white">
        {/* Scene 1: Core Value */}
		<div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-20 px-6 h-full space-y-24 rounded-t-lg shadow-lg">
          <div className="py-5">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p>
              At BAL-IT our goal is to provide a safer online experience for everyone. The digital landscape is increasingly evolving and shifting and it can be hard to keep up with it.
			  There are cookies to accept or reject, adverts on every page and content you just don&#39;t want to have in your life. Then if you in a position where you are responsible for other human beings there is so much more to think about.
			  We want to help take some of the stress out of existing online.
            </p>
          </div>

        {/* Scene 2: Backstory */}
          <div className="py-5">
            <p>
              With online safety at our center it&#39;s worth going over how we got here. I am the founder of BAL-IT, an IT consultant with two children.
			  As is common in society today they had access to a smart device from the age of 5. It was regulated heavily, configured as kids devices with content filters put in place,
			  Age restrictions applied to apps and online access curbed to only sites required for school homework. However, even with these processes in place there was still one area that seemed to be immune...Adverts.
			  Apps and websites use the most eye catching, emotive and attractive Ads they can to get our attention quickly, they also don&#39;t seem to adhere to any kind of personal restrictions.
			  After some online research I found some solutions that could work. After some trials I had a simple version of the current product.
			  Implementing it saw an immediate reduction in my childrens Ad exposure. They noticed the difference too and generally appreciated being able to play or work without the interruptions, sometimes they complained they could get bonus&#39; by watching Ads.
			  But generally they were happier with the smoother experience.
            </p>
          </div>

        {/* Scene 3: Easy Setup & Integration */}
          <div className="py-5">
            <p>
              As my children grew older I was increasingly aware of other content they may be exposed to as they moved through the devices Age barriers.
			  I decided to encorporate additional filtering rules for Adult Sites as well as looking into gambling, chatrooms and social media filters.
			  All of these additions allowed me a certain peace of mind when it came to my childrens devices, as well as some good conversations with them about the online world and safer ways to interact with it.
			  The main push for the product line however didn&#39;t come until 3 years after the initial implementation of the content filter.
			  My parents noticed that the children didn&#39;t have Ads at our house but at theirs they were getting more than ever with escalating problems with age appropriate content.
			  So I built another device to install at their house. They didn&#39;t want their devices to be filtered in the same way so I configured it to only affect the kids devices whilst leaving everything else on the network.
			  They also weren&#39;t particularly interested in maintaining it themselves so a rudementary version of this site was configured to monitor, fix and enhance the device as needed.
			  Finally this lead us here. A device that can be installed in your home to protect you and your family from online threats.
            </p>
          </div>
		  
		  <div className="py-5">
		   <h3 className="text-center text-2xl font-bold font-italic mb-4"><em>&#34;Every site you visit, Advert you click on or media you interact with builds a digital copy of you.&#34;</em></h3>
		  </div>
		  
		{/* Scene 4: It's all about you */}
          <div className="py-5">
            <p>
              It isn&#39;t just children who are at risk.
			  Every site you visit, Advert you click on or media you interact with builds a digital copy of you.
			  This copy is used to build a marketing profile which targets you with content Advertisers think you will like.
			  The more you interact with the world online the smarter it gets and soon enough it is able to advertise things you might like which you had never considered before.
			  This may sound great, it takes the thinking out of shopping right? This can be true, but it also gives them something to sell to other people.
			  Your digital self gets sold, passed around and tweaked and every part of you is laid bare for exploitation. It can also contribute heavily to things like addiction.
			  Porn , gambling, compulsive shopping, social media and even drugs can all be fed through online sources and the algorythms know this.
			  We want to help everyone have a safe experience online, without worrying about who or what could be watching, we hope you will allow us to help you too.
            </p>
          </div>
        </div>

      </section>

      {/* About the product */}
      <section className="bg-gray-100">
	  <div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-20 px-6 h-full space-y-24 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About the product</h2>
		  <Image src="/images/rpi1.png" alt="Base board" width={800} height={300} className="mx-auto rounded-lg mb-8 object-cover" />
          <p className="mb-4 py-3">
            Our content filter is built on a Raspberry Pi Zero 2 w using a 32GB A1 MicroSD card for storage. A Raspberry Pi is an SBC (Single Board Computer) that can run basic programs. It has:
		  </p>
		  <ul className="list-disc list-inside mt-2 space-y-1 py-3">
			<li>Processor: Broadcom BCM2710A1, quad-core 64-bit SoC (Arm Cortex-A53 @ 1GHz)</li>
			<li>RAM: 512MB LPDDR2</li>
			<li>Connectivity: 2.4GHz IEEE 802.11ac WiFi, Bluetooth 4.2 (with BLE Support), microSD Card Slot</li>
			<li>USB: 1 × USB 2.0 interface with OTG</li>
			<li>HDMI: Mini HDMI Port</li>
			<li>Input Power: 5V DC 2.5A</li>
			<li>Dimensions: 65 x 30 mm</li>
		  </ul>
		  <p className="mb-4 py-3">
			It runs a combination of tailored applications, however the content filter itself utilised an application called Pi-Hole.
			Pi-Hole is a DNS blackhole, this means that any requests made by a device on a network using it that match it&#39;s list of blocked addresses get dumped.
			This is an open source project and we donate 10% of each device sale to the program to keep it funded.
			You can get more information the project here:
          </p>
		  <Link href="https://pi-hole.net/" className="text-xl text-center mx-auto py-3 hover:text-white">Pi-Hole</Link>
		  <p className="mb-4 py-3">
		    We also integrate it with a one way VPN service to provide the managed service for the devices. This allows up to get the basic data you will see in your dashboard.
			As well as fascilitating updates, status monitoring and remote fixes.
		  </p>
		  <p className="mb-4 py-3">
		    None of your data ever touches our servers. We don&#39;t record or store your browsing histories or web use. The only information we collect in anonymised performance data and the device status for monitoring and support.
		  </p>
          <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
            Purchase
          </Link>
        </div>
		</div>
      </section>

      {/* Hourly Support */}
      <section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] text-white">
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
