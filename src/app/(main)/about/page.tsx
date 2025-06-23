'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';

const roadmapData = [
  {
    title: 'Current Setup',
    summary: 'Devices are manually placed into filtering groups by our team.',
    details: 'Currently, devices are assigned to 6 fixed lists. Adjustments are made manually to ensure filtering is suitable for each use case.',
  },
  {
    title: 'User Control via Web App',
    summary: 'You’ll soon be able to manage filter groups yourself.',
    details: 'Our upcoming web update will allow full client-side control of filter assignments from your dashboard — live and in real time.',
  },
  {
    title: 'Mobile VPN Integration',
    summary: 'Scan a QR to block ads on the go.',
    details: 'A secure one-way VPN will allow users to tunnel DNS traffic through their home filter from any location. Easy setup with a QR code.',
  },
  {
    title: 'Remote Setup Device',
    summary: 'A plug-in device with remote install support.',
    details: 'You’ll receive a configured device to plug into your network. We’ll arrange a call to help you complete the setup remotely.',
  },
  {
    title: 'Wi-Fi Filtering Device',
    summary: 'Broadcasts its own network to filter select devices.',
    details: 'A new version will create a Wi-Fi signal for filtered access only. You choose what connects, and what stays untouched.',
  },
  {
    title: 'Feature Enhancements',
    summary: 'Ongoing improvements to UX and performance.',
    details: 'We’ll be expanding dashboard tools, improving reporting, and adding scheduling and enhanced parental controls.',
  },
  {
    title: 'Custom Router + Blocking Engine',
    summary: 'Full control with our own software and router.',
    details: 'Long term, we’ll release a custom router running in-house filtering software for full privacy, performance, and protection.',
  },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setExpandedIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setExpandedIndex(null), 3000);
  };

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
		  <div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-16 px-6 h-full space-y-24 rounded-t-lg shadow-lg">

			{/* Scene 1: Core Value */}
			<div className="max-w-4xl mx-auto py-5 text-center space-y-6">
			  <h2 className="text-4xl font-bold py-5">About Us</h2>
			  <p>
				At BAL-IT our goal is to provide a safer online experience for everyone. The digital landscape is increasingly evolving and shifting and it can be hard to keep up with it.
				There are cookies to accept or reject, adverts on every page and content you just don&#39;t want to have in your life. Then if you in a position where you are responsible for other human beings there is so much more to think about.
				We want to help take some of the stress out of existing online.
			  </p>
			</div>

			{/* Divider */}
			<div className="flex justify-center">
			  <div className="flex items-center space-x-4 text-gray-400">
				<span className="w-24 h-px bg-gray-500" />
				<span className="text-xl">★</span>
				<span className="w-24 h-px bg-gray-500" />
			  </div>
			</div>

			{/* Scene 2: Backstory */}
			<div className="max-w-4xl mx-auto py-5 text-center space-y-6">
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

			{/* Divider */}
			<div className="flex justify-center">
			  <div className="flex items-center space-x-4 text-gray-400">
				<span className="w-24 h-px bg-gray-500" />
				<span className="text-xl">🔧</span>
				<span className="w-24 h-px bg-gray-500" />
			  </div>
			</div>

			{/* Scene 3: Easy Setup & Integration */}
			<div className="max-w-4xl mx-auto py-5 text-center space-y-6">
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

			{/* Quote */}
			<div className="py-10">
			  <h3 className="text-center text-2xl font-bold italic">
				&#34;Every site you visit, Advert you click on or media you interact with builds a digital copy of you.&#34;
			  </h3>
			</div>

			{/* Scene 4: It's All About You */}
			<div className="max-w-4xl mx-auto py-5 text-center space-y-6">
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

			{/* Final Message */}
			<div className="pt-10 max-w-3xl mx-auto text-center text-lg font-medium text-gray-300">
			  <p>
				We will continue to strive for greater security and enhancements to your experiences online.<br />
				<strong className="text-white">Thank you.</strong>
			  </p>
			</div>

		  </div>
		</section>


      {/* About the product */}
      <section className="bg-gray-100">
	  <div className="bg-gray-800/60 w-full mx-auto max-w-7xl py-20 px-6 h-full space-y-24 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About the product</h2>
		  <p className="mb-4 py-3">
            Our content filter is built on a Raspberry Pi Zero 2 w using a 32GB A1 MicroSD card for storage. A Raspberry Pi is an SBC (Single Board Computer) that can run basic programs. Here are the technical specifications:
		  </p>
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
		  <ul className="list-disc list-outside text-l text-left mt-2 space-y-1 py-3 p-8">
			<li>Processor: Broadcom BCM2710A1, quad-core 64-bit SoC (Arm Cortex-A53 @ 1GHz)</li>
			<li>RAM: 512MB LPDDR2</li>
			<li>Connectivity: 2.4GHz IEEE 802.11ac WiFi, Bluetooth 4.2, microSD Card Slot</li>
			<li>USB: 1 × USB 2.0 interface with OTG</li>
			<li>HDMI: Mini HDMI Port</li>
			<li>Input Power: 5V DC 2.5A</li>
			<li>Dimensions: 65 x 30 mm</li>
		  </ul>
		  <Image src="/images/rpi1.png" alt="Base board" width={500} height={200} className="mx-auto rounded-lg mb-8 object-cover bg-white" />
		  </div>
		  <p className="mb-4 py-3">
			It runs a combination of tailored applications, however the content filter itself utilised an application called Pi-Hole.
			Pi-Hole is a DNS blackhole, this means that any website or app requests made by a device on the network using it get dumped, if they match it&#39;s list of blocked addresses.
			It offers a lot of customisation features which we are working on implementing in the web app, you can see details for this in our roadmap section below.
			This is an open source project and we donate 10% of each device sale to the program to keep it funded.
			You can get more information the project here:
          </p>
		  <Link href="https://pi-hole.net/" className="text-xl text-center mx-auto py-3 hover:text-white">Pi-Hole</Link>
		  <p className="mb-4 py-3">
		    We also integrate it with a one way VPN to provide the managed service for the devices. This allows up to get the basic data you will see in your dashboard.
			As well as fascilitating updates, status monitoring and remote fixes. It will also allow us to implement changes you request remotely.
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

      {/* Road map */}
      <section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] text-white">
		<div className="bg-gray-800/60 relative max-w-7xl mx-auto px-4 z-10">
			<h2 className="text-3xl font-bold text-center py-12 mb-16">Device Development Roadmap</h2>

			{/* --- Top Centered Card --- */}
			<div className="relative z-20 mb-20 flex justify-center">
			  <div
				className="bg-white rounded-2xl shadow-md p-6 text-center w-full md:w-2/3 lg:w-1/2"
				onMouseEnter={() => setExpandedIndex(0)}
				onMouseLeave={handleMouseLeave}
			  >
				<h3 className="text-xl text-gray-700 font-bold mb-2">{roadmapData[0].title}</h3>
				<p className="text-gray-700 mb-4">{roadmapData[0].summary}</p>
				<div
				  className={`transition-opacity duration-300 ${
					expandedIndex === 0 ? 'opacity-100' : 'opacity-0 h-0'
				  }`}
				>
				  <p className="text-gray-600">{roadmapData[0].details}</p>
				</div>
				<div className="w-full text-center mt-4">
				  <span className="inline-block text-blue-600 text-xl">▼</span>
				</div>
			  </div>
			</div>

			{/* --- Vertical Line (below top card to last item) --- */}
			<div className="absolute left-1/2 transform -translate-x-1/2 top-[260px] bottom-[80px] w-1 bg-blue-500 z-0" />

			{/* --- Remaining Timeline Items --- */}
			<div className="space-y-24">
			  {roadmapData.slice(1).map((item, index) => {
				const realIndex = index + 1;
				const isLeft = index % 2 === 0;
				return (
				  <div
					key={realIndex}
					className={`relative group transition-all duration-300 ${
					  isLeft ? 'md:pr-[55%]' : 'md:pl-[55%]'
					}`}
					onMouseEnter={() => handleMouseEnter(realIndex)}
					onMouseLeave={handleMouseLeave}
				  >
					{/* Timeline dot */}
					<div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-4 border-white rounded-full z-20 top-5" />

					{/* Timeline card */}
					<div
					  className={`relative bg-white rounded-2xl shadow-md p-6 transition-all duration-500 ${
						expandedIndex === realIndex
						  ? 'max-h-[1000px]'
						  : 'max-h-[160px] overflow-hidden'
					  } ${isLeft ? 'ml-auto mr-0 md:w-1/2' : 'mr-auto ml-0 md:w-1/2'}`}
					>
					  <h3 className="text-xl text-gray-700 font-bold mb-2">{item.title}</h3>
					  <p className="text-gray-700 mb-4">{item.summary}</p>
					  <div
						className={`transition-opacity duration-300 ${
						  expandedIndex === realIndex ? 'opacity-100' : 'opacity-0 h-0'
						}`}
					  >
						<p className="text-gray-600">{item.details}</p>
					  </div>
					  <div className="w-full text-center mt-4">
						<span className="inline-block text-blue-600 text-xl">▼</span>
					  </div>
					</div>
				  </div>
				);
			  })}
			{/* --- Final Message Centered --- */}
			<div className="relative z-20 mt-20 flex justify-center py-6">
			  <div className="bg-white rounded-2xl shadow-md p-6 text-center w-full md:w-2/3 lg:w-1/2">
				<h3 className="text-xl text-gray-700 font-bold mb-2">Looking Ahead</h3>
				<p className="text-gray-700">
				  We will continue to strive for greater security and enhancements to your experiences online. Thank you.
				</p>
			  </div>
			</div>
			</div>
		  </div>
      </section>
    </>
  );
}
