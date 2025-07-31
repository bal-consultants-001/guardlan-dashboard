'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import TicketNotesModal from '@/components/TicketNotesModal'
import type { User } from '@supabase/supabase-js'

type Ticket = {
  id: string
  ticket_no: string
  status: string
  short_desc?: string
  supp_user?: string
  owner?: string
  engineerName?: string
  customerName?: string
}

export default function AdminTicketsTable() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [adminUser, setAdminUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return

      setAdminUser(user)

      // Fetch all users (engineers and customers)
      const { data: usersData } = await supabase.from('users').select('uuid, firstname')
      const userMap = new Map<string, string>()
      usersData?.forEach(user => userMap.set(user.uuid, user.firstname))

      // Fetch all owners (customers)
      const { data: ownersData } = await supabase.from('owner').select('"ID", "Fullname"')
      const ownerMap = new Map<string, string>()
      ownersData?.forEach(owner => ownerMap.set(owner.ID, owner.Fullname))

      // Fetch all tickets
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('id, ticket_no, status, short_desc, supp_user, owner')

      const mappedTickets = (ticketData || []).map((ticket) => ({
        ...ticket,
        engineerName: userMap.get(ticket.supp_user || '') || 'Unassigned',
        customerName: ownerMap.get(ticket.owner || '') || 'Unknown',
      }))

      setTickets(mappedTickets)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading tickets...</p>

  return (
    <>
      <h2 className="text-xl font-semibold mt-8 mb-2">All Support Tickets</h2>
      <table className="table-auto w-full border-collapse border mt-4 text-sm">
        <thead>
          <tr className="bg-gray-100 text-black">
            <th className="border px-2 py-1">Ticket No</th>
            <th className="border px-2 py-1">Customer</th>
            <th className="border px-2 py-1">Subject</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Engineer</th>
            <th className="border px-2 py-1">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td className="border px-2 py-1">{ticket.ticket_no}</td>
              <td className="border px-2 py-1">{ticket.customerName}</td>
              <td className="border px-2 py-1">{ticket.short_desc}</td>
              <td className="border px-2 py-1">{ticket.status}</td>
              <td className="border px-2 py-1">{ticket.engineerName}</td>
              <td className="border px-2 py-1">
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  onClick={() => setSelectedTicketId(ticket.id)}
                >
                  View Notes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTicketId && adminUser && (
        <TicketNotesModal
          ticketId={selectedTicketId}
          user={adminUser}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </>
  )
}
