'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {

  return (
    <>

      {/* Hero */}
      <section className="relative bg-black text-white h-[400px] flex items-center justify-center">
	  {/*<Image src="/images/blockers.png" alt="Network Protection" fill className="object-cover opacity-10" />*/}
        <div className="absolute z-10 text-center px-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Total Ad & Content Control — No Apps, No Downloads.</h1>
          <p className="mb-6 text-lg">Plug in. Block ads. Filter content. Protect every device on your home network — instantly.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">Get Yours Now</Link>
            <Link href="#how-it-works" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">How It Works</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20 text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <p className="mb-12 text-gray-700">So simple, it feels like magic.</p>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto text-left">
          {[
            { step: 'Plug In', desc: 'Connect the BAL-IT device to your home router.' },
            { step: 'Set Preferences', desc: 'Use our web dashboard to choose filters and protections.' },
            { step: 'Enjoy Internet', desc: 'Ads gone. Content filtered. Family-safe browsing for all devices.' }
          ].map(({ step, desc }, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="text-blue-600 text-3xl font-bold mb-2">{i + 1}</div>
              <h3 className="text-xl font-semibold mb-2">{step}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-lg font-semibold text-gray-800">Works with ALL smart devices — no installs required.</p>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
		  <h2 className="text-3xl font-bold text-center mb-12">What Makes BAL-IT Different?</h2>

		  {/* Before and After Images */}
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto mb-16 px-4">
			{/* AdBlocker OFF */}
			<div className="text-center">
			  <div className="w-full h-[500px] md:h-[400px] overflow-hidden rounded-xl shadow-lg">
				<Image
				  src="/images/AdBlocker-off.png"
				  alt="With Ads (AdBlocker Off)"
				  width={600}
				  height={400}
				  className="object-cover object-center"
				  sizes="(max-width: 668px) 100vw, 50vw"
				/>
			  </div>
			  <p className="mt-4 text-lg font-semibold text-red-500">Without Ad & Content Shield (Ads Active)</p>
			</div>

			{/* AdBlocker ON */}
			<div className="text-center">
			  <div className="w-full h-[500px] md:h-[400px] overflow-hidden rounded-xl shadow-lg">
				<Image
				  src="/images/AdBlocker-on.png"
				  alt="Ad-Free (AdBlocker On)"
				  width={600}
				  height={400}
				  className="object-cover object-center"
				  sizes="(max-width: 368px) 100vw, 50vw"
				/>
			  </div>
			  <p className="mt-4 text-lg font-semibold text-green-500">With Ad & Content Shield (Ads Blocked)</p>
			</div>
		  </div>

		  {/* Features Grid */}
		  <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center px-4">
			{[
			  ['Ad Blocking Across Your Network', 'block'],
			  ['Parental Controls & Custom Filters', 'shield-check'],
			  ['Easy Web Dashboard', 'layout-dashboard']
			].map(([title], i) => (
			  <div key={i} className="bg-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition">
				<h3 className="text-lg font-semibold mb-2">{title}</h3>
				<p className="text-gray-600">Simple, powerful protection for your entire digital home.</p>
			  </div>
			))}
		  </div>
		</section>



      {/* Product Callout */}
      <section className="bg-blue-50 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Buy BAL-IT Today</h2>
        <p className="mb-8 text-gray-700 max-w-xl mx-auto">Protect every device in your home from intrusive ads, harmful content, and distractions — all with one tiny box.</p>
        <Image src="/images/bal-it.png" alt="BAL-IT Device" width={200} height={200} className="mx-auto mb-6" />
        <p className="text-xl font-semibold mb-4">€79.99 — Free UK Shipping</p>
        <Link href="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">Order Now</Link>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} BAL-IT. All rights reserved.</p>
      </footer>
    </>
  );
}
