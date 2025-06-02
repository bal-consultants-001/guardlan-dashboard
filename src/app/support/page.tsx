//tickets

'use client'

type Ticket = {
  ticket_no: string
  status: string
  // Add more fields as needed
}

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  
  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    router.push('/');
  }
  };

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
        .eq('id', userId)
      setTickets(ticketData || [])
    };

    fetchData()
  }, [router])
  	
  if (!user) return <p>Loading tickets...</p>

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
	  <section className="py-10 px-4 text-center">
		<div className="py-8 grid md:grid-cols-3 gap-6 float-right">
			<Link href="/">
				<a className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
					Back to Home
				</a>
			</Link>
			<Link href="/shop">
				<a className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
					Shop Now
				</a>
			</Link>
			<button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800" onClick={handleLogout}>
			  Log Out
			</button>
		</div>
      </section>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}</h1>

      {/* Tickets Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Support Tickets</h2>
        {tickets.length === 0 ? (
          <p>No support tickets yet.</p>
        ) : (
          <ul className="list-disc ml-5">
            {tickets.map((ticket: Ticket) => (
              <li key={ticket.ticket_no}>
                Ticket #{ticket.ticket_no} — {ticket.status}
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => router.push('/support/new')}
        >
          Raise a New Ticket
        </button>
      </section>
    </main>
  )
}
