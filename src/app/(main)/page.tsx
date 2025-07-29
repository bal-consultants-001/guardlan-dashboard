'use client';

import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head'
import { ShieldCheck, LayoutDashboard, Ban } from 'lucide-react';


const icons = {
  'ban': Ban,
  'shield-check': ShieldCheck,
  'layout-dashboard': LayoutDashboard,
};


export default function HomePage() {

  return (
    <>
	
	<Head>
	  <title>Home Network AdBlocker | Block Ads on All Devices</title>
	  <meta name="description" content="Protect your entire home network from ads and trackers with our plug-and-play AdBlocker." />
	  <link rel="canonical" href="https://www.bal-it.com" />
	</Head>

      {/* Hero */}
		<section className="relative bg-black text-white min-h-[400px] md:h-[400px] py-12 flex items-center justify-center">
		  <Image src="/images/AdBlocker0.png" alt="Ad Blocker" fill className="object-cover opacity-30" />
		  <div className="absolute z-10 text-center px-4 max-w-2xl">
			<h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
			  Total Ad & Content Control — No Apps, No Downloads.
			</h1>
			<p className="mb-6 text-lg">
			  Plug in. Block ads. Filter content. Protect every device on your home network — instantly.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
			  <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
				Get Yours Now
			  </Link>
			  <Link href="#how-it-works" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">
				How It Works
			  </Link>
			</div>
		  </div>
		</section>


      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20 text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <p className="mb-12 text-gray-700">So simple, it feels like magic.</p>
		
			<div className="flex justify-center py-5">
			  <span className="w-8/9 mx-auto h-px bg-[var(--color-blue2)] block" />
			</div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6/9 mx-auto text-left">
          {[
            { step: 'Connect In', desc: 'We connect the Ad & Content filter device to your home wifi.' },
            { step: 'Set Preferences', desc: 'You use our web dashboard to choose filters and protections.' },
            { step: 'Enjoy Internet', desc: 'Ads gone. Content filtered. Family-safe browsing for all devices.' }
          ].map(({ step, desc }, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="text-blue-600 text-3xl font-bold mb-2">{i + 1}</div>
              <h3 className="text-xl font-semibold mb-2">{step}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
		
		<div className="flex justify-center py-5">
		  <span className="w-8/9 mx-auto h-px bg-[var(--color-blue2)] block" />
		</div>

        <p className="mt-10 text-lg font-semibold text-gray-800">Works with ALL smart devices — no installs required.</p>
      </section>

      {/* Features */}
      <section className="bg-[var(--color-blue2)] py-20">
		  <h2 className="text-3xl font-bold text-white text-center mb-12">What Makes BAL-IT Different?</h2>
		  <p className="text-xl text-white text-center mb-6">
			We remove Ads and unwanted content before they hit your devices
		  </p>
		  
		  <div className="grid grid-cols-2 gap-4 w-full bg-white h-auto mx-auto mb-8 px-4 text-center">
		    <h2 className="text-sm md:text-lg font-semibold text-red-800">Without Ad & Content Shield</h2>
		    <h2 className="text-sm md:text-lg font-semibold text-green-500">With Ad & Content Shield</h2>
		  </div>


		  {/* Before and After Images */}
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start items-center max-w-7/9 mx-auto mb-16 px-4">
			{/* AdBlocker OFF */}
			<div className="text-center">
			  
			  <div className="aspect-[16/13] w-full min-w-8/9 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition">
				<Image
				  src="/images/AdBlocker-off.png"
				  alt="With Ads (AdBlocker Off)"
				  width={900}
				  height={800}
				  className="object-cover object-center w-full h-full"
				  sizes="(max-width: 668px) 100vw, 50vw"
				/>
			  </div>
			  
			</div>

			{/* AdBlocker ON */}
			<div className="text-center">
			  
			  <div className="aspect-[16/13] w-full min-w-8/9 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition">
			  	<Image
				  src="/images/AdBlocker-on.png"
				  alt="Ad-Free (AdBlocker On)"
				  width={900}
				  height={800}
				  className="object-cover object-center w-full h-full"
				  sizes="(max-width: 368px) 100vw, 50vw"
				/>
			  </div>
			  
			</div>
		  </div>
		  
		  <p className="text-xl text-white text-center mb-6">
			It&#39;s not just websites. Mobile devices see the benefit also...
		  </p>
		  
		  {/*Divider*/}
		  	<div className="flex justify-center">
			  <span className="w-8/9 mx-auto h-px bg-white block" />
			</div>
		  
		  {/*Videos*/}
		  <div className="grid grid-cols-2 gap-4 max-w-6/9 mx-auto mb-10 px-4">
		  	  <div className="flex flex-col md:flex-row gap-4 justify-center items-center py-8">
			  	<video
				  src="/videos/With-Ads.mp4"
				  autoPlay
				  loop
				  muted
				  playsInline
				  className="w-full md:w-1/2 rounded shadow-lg"
			    />
			  </div>
			  
			  <div className="flex flex-col md:flex-row gap-4 justify-center items-center py-8">
			    <video
				  src="/videos/Without-Ads.mp4"
				  autoPlay
				  loop
				  muted
				  playsInline
				  className="w-full md:w-1/2 rounded shadow-lg"
			    />
			  </div>
			</div>
			
		  {/*Divider*/}
		  	<div className="flex justify-center">
			  <span className="w-8/9 mx-auto h-px bg-white block" />
			</div>

		  {/* Features Grid */}
			<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center px-4 py-6">
			  {[
				  ['Ad Blocking Across Your Network', 'ban', 'Automatically block intrusive ads, trackers, and malware for all devices at once.'],
				  ['Parental Controls & Custom Filters', 'shield-check', 'Set age-appropriate restrictions and customize web access for every user.'],
				  ['Easy Web Dashboard', 'layout-dashboard', 'Manage settings, view reports, and control access from a simple online interface.'],
				].map(([title, iconKey, description], i) => {
				  const IconComponent = icons[iconKey as keyof typeof icons];
				  return (
					<div key={i} className="bg-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition">
					  <IconComponent className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
					  <h3 className="text-lg font-semibold mb-2">{title}</h3>
					  <p className="text-gray-600">{description}</p>
					</div>
				  );
				})}

			</div>
		</section>



      {/* Product Callout */}
      <section className="bg-blue-50 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Get Yours Today</h2>
        <p className="mb-8 text-gray-700 max-w-xl mx-auto">Protect every device in your home from intrusive ads, harmful content, and distractions — all with one tiny box.</p>
        <Image src="/images/AdBlocker5.png" alt="BAL-IT Device" width={400} height={400} className="mx-auto mb-6 shadow-md hover:shadow-lg transition" />
        <p className="text-xl font-semibold mb-4">£75 — Including Installation</p>
        <Link href="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">Order Now</Link>
      </section>
    </>
  );
}
