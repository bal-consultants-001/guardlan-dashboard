//new ticket

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase'; // adjust path if needed

const NewSupportTicketPage = () => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [device, setDevice] = useState('');
  const [devices, setDevices] = useState<{ taID: string; Hostname: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      const { data, error } = await supabase.from('Devices').select('taID, Hostname');
      if (error) {
        console.error('Error fetching devices:', error);
      } else {
        setDevices(data);
      }
    };

    fetchDevices();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (shortDesc.trim().length < 15) {
      return setError('Short description must be at least 15 characters.');
    }

    if (description.trim().length < 50) {
      return setError('Description must be at least 50 characters.');
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return setError('Unable to fetch user.');
    }

    const { error: insertError } = await supabase.from('tickets').insert([
      {
        short_desc: shortDesc,
        description,
        device,
        owner: user.id,
        status: 'New',
        user: null, // remains empty
      },
    ]);

    if (insertError) {
      return setError('Failed to create ticket. Please try again.');
    }

    setSuccess(true);
    setShortDesc('');
    setDescription('');
    setDevice('');

    setTimeout(() => {
      router.push('/support'); // redirect after success
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Log a New Support Ticket</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">Ticket submitted successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Short Description</label>
          <input
            type="text"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter a brief summary (min 15 characters)"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Full Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded min-h-[120px]"
            placeholder="Enter detailed description (min 50 characters)"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Related Device</label>
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select a device</option>
            {devices.map((d) => (
              <option key={d.taID} value={d.taID}>
                {d.Hostname}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default NewSupportTicketPage;
