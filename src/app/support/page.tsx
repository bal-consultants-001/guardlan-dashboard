//tickets

'use client'

type Ticket = {
  ticket_no: string
  status: string
  short_desc?: string
  supp_user?: string
  // Add more fields as needed
}

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [fullName, setFullName] = useState<string | null>(null)
  
  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    router.push('/');
  }
  };

	const userId = session.user.id
	setUser(session.user)

	// Fetch full name
	const { data: userData } = await supabase
	  .from('owner')
	  .select('"Fullname"')
	  .eq('"ID"', userId)
	  .single();

	if (userData) {
	  setFullName(userData["Fullname"]);
	}

  useEffect(() => {
    const fetchData = async () => {
      const { supabase } = await import('@/lib/supabase')

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/login')
        return
      }

      const userId = session.user.id
      setUser(session.user)

      // Fetch tickets
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('*')
        .eq('owner', userId)
      setTickets(ticketData || [])
    };

    fetchData()
  }, [router])
  	
  if (!user) return <p>Loading tickets...</p>

  return (
    <Layout>
	  <section className="bg-[linear-gradient(to_right,var(--color-red1),var(--color-purple2),var(--color-blue2))] w-full py-4 overflow-hidden">
		<div className="py-8 grid md:grid-cols-3 gap-6 float-right">
			<Link href="/" className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
					Back to Home
			</Link>
			<Link href="/dashboard" className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
					Dashboard
			</Link>
			<button className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800" onClick={handleLogout}>
			  Log Out
			</button>
		</div>
      </section>
	  
	  <section className="py-10 px-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Welcome, {fullName || user.email}</h1>
	  </section>

      {/* Tickets Section */}
      <section className="py-10 px-10 w-full">
        <h2 className="text-xl font-semibold mb-2">Support Tickets</h2>
        {tickets.length === 0 ? (
          <p>No support tickets yet.</p>
        ) : (
			<table className="table-auto w-full border-collapse border outline outline-1 outline-gray-400 overflow-hidden text-center rounded-lg">
			  <thead>
				<tr>
				  <th className="border px-4 py-2">Ticket No</th>
				  <th className="border px-4 py-2">Subject</th>
				  <th className="border px-4 py-2">Status</th>
				  <th className="border px-4 py-2">Engineer</th>
				</tr>
			  </thead>
			  <tbody>
				{tickets.map((ticket) => (
				  <tr key={ticket.ticket_no}>
					<td className="border px-4 py-2">{ticket.ticket_no}</td>
					<td className="border px-4 py-2">{ticket.short_desc || 'N/A'}</td>
					<td className="border px-4 py-2">{ticket.status}</td>
					<td className="border px-4 py-2">{ticket.supp_user || 'Unassigned'}</td>
				  </tr>
				))}
			  </tbody>
			</table>
        )}
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => router.push('/support/new')}
        >
          Raise a New Ticket
        </button>
      </section>
    </Layout>
  )
}
