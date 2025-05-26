'use client'

type Order = {
  id: string
  status: string
  // Add more fields as needed
}

type Device = {
  "Hostname": string
  "OS": string
  "Model": string
  // Add more fields as needed
}

type Ticket = {
  ticket_no: string
  status: string
  // Add more fields as needed
}

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])

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

      // Fetch orders
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('id', userId)
      setOrders(orderData || [])

      // Fetch devices
      const { data: deviceData } = await supabase
        .from('devices')
        .select('*')
        .eq('"Owner"', userId)
      setDevices(deviceData || [])

      // Fetch tickets
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', userId)
      setTickets(ticketData || [])
    }

    fetchData()
  }, [router])

  if (!user) return <p>Loading dashboard...</p>

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}</h1>

      {/* Orders Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="list-disc ml-5">
            {orders.map((order) => (
			  <li key={order.id}>
				Order #{order.id} — {order.status}
			  </li>
			))}
          </ul>
        )}
      </section>

      {/* Devices Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Your Devices</h2>
        {devices.length === 0 ? (
          <p>No active devices.</p>
        ) : (
          <ul className="list-disc ml-5">
            {devices.map((device) => (
			  <li key={device["Hostname"]}>
				{device["OS"]} ({device["Model"]})
			  </li>
			))}
          </ul>
        )}
      </section>

      {/* Tickets Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Support Tickets</h2>
        {tickets.length === 0 ? (
          <p>No support tickets yet.</p>
        ) : (
          <ul className="list-disc ml-5">
            {tickets.map((ticket: any) => (
              <li key={ticket.id}>
                Ticket #{ticket.id} — {ticket.status}
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
