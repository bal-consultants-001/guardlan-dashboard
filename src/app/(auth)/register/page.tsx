'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!agreedToTerms) {
      setMessage('You must agree to the Terms and Conditions before registering.');
      return;
    }

    const { supabase } = await import('@/lib/supabase'); // Lazy load Supabase
	const { error } = await supabase.auth.signUp({
	  email,
	  password,
	  phone,
	  options: {
		data: {
		  terms_accepted: true,
		  terms_accepted_at: new Date().toISOString(),
		},
	  },
	});

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Check your email to confirm registration.');
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <input
          className="border p-2 w-full mb-4 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="tel"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Terms and Conditions agreement */}
        <div className="flex items-start gap-2 text-sm mb-4">
          <input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-gray-700">
            I have read and understand the{' '}
            <a
              href="/documents/Terms and Conditions.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Terms and Conditions
            </a>
            .
          </label>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            className={`px-4 py-2 rounded transition text-white ${
              agreedToTerms ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleRegister}
            disabled={!agreedToTerms}
          >
            Register
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={() => router.push('/')}
          >
            Cancel
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-red-600 text-center">{message}</p>}
      </section>
    </main>
  );
}
