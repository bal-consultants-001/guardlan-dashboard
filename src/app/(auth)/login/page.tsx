//login page

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setMessage(`Error: ${signInError.message}`);
      console.error(signInError);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage('Failed to get user information.');
      return;
    }

    if (!user.email_confirmed_at) {
      setMessage('Please verify your email before continuing.');
      return;
    }

    const { data: ownerData, error: ownerError } = await supabase
      .from('owner')
      .select('Firstname,Lastname')
      .eq('ID', user.id)
      .single();

    if (ownerError) {
      setMessage(`Error fetching profile: ${ownerError.message}`);
      return;
    }

    const { Firstname, Lastname } = ownerData;

    if (!Firstname || !Lastname) {
      router.push('/complete-profile');
    } else {
      const checkoutIntent = localStorage.getItem('checkoutIntent');

      if (checkoutIntent === 'true') {
        localStorage.removeItem('checkoutIntent');
        router.push('/shop?checkout=true');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

	  <section className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input
          className="border p-2 w-full mb-4 rounded"
          placeholder="Your email"
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
        <div className="flex flex-col space-y-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleLogin}
          >
            Sign In
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

