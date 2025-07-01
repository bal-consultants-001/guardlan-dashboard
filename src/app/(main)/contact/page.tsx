// contact.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Information',
    message: '',
  });

  const subjects = [
    'General Information',
    'Device Enquiry',
    'Service Enquiry',
    'Review',
    'Complaints',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    alert('Your message has been sent!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Information',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const postcodeAreas = ['CF61', 'CF62', 'CF63', 'CF64', 'CF71', 'CF72', 'CF5', 'CF11', 'CF10']; // Example list, see note below

  return (
    <>
	
      {/* Hero */}
      <section className="relative bg-black text-white h-[400px] flex items-center justify-center">
	  <Image src="/images/AdBlocker0.png" alt="Ad Blocker" fill className="object-cover opacity-30" />
        <div className="absolute z-10 text-center px-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Total Ad & Content Control — No Apps, No Downloads.</h1>
          <p className="mb-6 text-lg">Plug in. Block ads. Filter content. Protect every device on your home network — instantly.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">Get Yours Now</Link>
            <Link href="#how-it-works" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">How It Works</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[var(--color-blue2)] text-white">
        <div className="bg-gray-800/60 max-w-7xl mx-auto py-20 px-6 space-y-12 rounded-t-lg shadow-lg">
          <div>
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p>If you want to get additional information about our services, enquire about your device, or ask about services in your area, please fill in the form below or email us at:</p>
            <h3 className="font-bold mt-4">information@bal-it.com</h3>
          </div>

          <div className="bg-white text-black p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
		  <form onSubmit={handleSubmit} className="space-y-6">
			<div>
			  <label htmlFor="name" className="block font-medium mb-2">Your Name</label>
			  <input
				type="text"
				name="name"
				id="name"
				required
				value={formData.name}
				onChange={handleChange}
				className="w-full p-3 border border-gray-300 rounded"
			  />
			</div>

			<div>
			  <label htmlFor="email" className="block font-medium mb-2">Email Address</label>
			  <input
				type="email"
				name="email"
				id="email"
				required
				value={formData.email}
				onChange={handleChange}
				className="w-full p-3 border border-gray-300 rounded"
			  />
			</div>

			<div>
			  <label htmlFor="phone" className="block font-medium mb-2">Phone Number</label>
			  <input
				type="tel"
				name="phone"
				id="phone"
				required
				value={formData.phone}
				onChange={handleChange}
				className="w-full p-3 border border-gray-300 rounded"
			  />
			</div>

			<div>
			  <label htmlFor="subject" className="block font-medium mb-2">Enquiry Type</label>
			  <select
				name="subject"
				id="subject"
				value={formData.subject}
				onChange={handleChange}
				className="w-full p-3 border border-gray-300 rounded"
			  >
				{subjects.map(subject => (
				  <option key={subject} value={subject}>{subject}</option>
				))}
			  </select>
			</div>

			<div>
			  <label htmlFor="message" className="block font-medium mb-2">Your Message</label>
			  <textarea
				name="message"
				id="message"
				rows={6}
				required
				value={formData.message}
				onChange={handleChange}
				className="w-full p-3 border border-gray-300 rounded"
			  />
			</div>

			<button type="submit" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
			  Send Message
			</button>
		  </form>
		</div>
        </div>
      </section>

      {/* Map Section */}
		<section className="bg-gray-100 py-20">
		  <div className="max-w-6xl mx-auto px-6">
			<div className="bg-white text-black p-8 rounded-lg shadow-xl">
			  <div className="text-center space-y-8">
				<p className="text-xl font-medium">We operate in the following postcodes:</p>
				<div className="flex flex-wrap justify-center gap-3 text-base">
				  {postcodeAreas.map(code => (
					<span key={code} className="bg-gray-200 px-4 py-2 rounded">{code}</span>
				  ))}
				</div>
			  </div>
			</div>
		  </div>
		</section>

    </>
  );
}
