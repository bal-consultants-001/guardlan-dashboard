'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase';
import TicketNotesModal from '@/components/TicketNotesModal'

type Ticket = {
  id: string
  ticket_no: string
  status: string
  short_desc?: string
  supp_user?: string // still store the UUID
  engineerName?: string // this is what we’ll display
}

export default function TicketsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [fullName, setFullName] = useState<string | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  useEffect(() => {
	const fetchData = async () => {
	  const {
		data: { session },
	  } = await supabase.auth.getSession()

	  if (!session?.user) {
		router.push('/login')
		return
	  }

	  const userId = session.user.id
	  setUser(session.user)

	  // 1. Fetch all engineers (users)
	  const { data: usersData } = await supabase
		.from('users')
		.select('uuid, firstname')

	  const userMap = new Map<string, string>()
	  usersData?.forEach((user) => {
		userMap.set(user.uuid, user.firstname)
	  })

	  // 2. Fetch tickets
	  const { data: ticketData } = await supabase
		.from('tickets')
		.select('id, ticket_no, status, short_desc, supp_user')
		.eq('owner', userId)

	  // 3. Map tickets to include engineer name
	  const mappedTickets = (ticketData || []).map((ticket) => ({
		...ticket,
		engineerName: userMap.get(ticket.supp_user || '') || 'Unassigned',
	  }))

	  setTickets(mappedTickets)

	  // 4. Fetch owner full name
	  const { data: userData } = await supabase
		.from('owner')
		.select('"Fullname"')
		.eq('"ID"', userId)
		.single()

	  if (userData) {
		setFullName(userData["Fullname"])
	  }
	}


    fetchData()
  }, [router])

  if (!user) return <p>Loading tickets...</p>

  return (
    <>
      <section className="py-10 px-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Welcome, {fullName || user.email}</h1>
      </section>

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
                <th className="border px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticket_no}>
                  <td className="border px-4 py-2">{ticket.ticket_no}</td>
                  <td className="border px-4 py-2">{ticket.short_desc || 'N/A'}</td>
                  <td className="border px-4 py-2">{ticket.status}</td>
                  <td className="border px-4 py-2">
				    {ticket.engineerName}
				  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => setSelectedTicketId(ticket.id)}
                    >
                      View Notes
                    </button>
                  </td>
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

      {selectedTicketId && user && (
        <TicketNotesModal
          ticketId={selectedTicketId}
          user={user}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </>
  )
}
