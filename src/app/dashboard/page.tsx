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
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
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
		.eq('"OS"', 'linux')
      setDevices(deviceData || [])
	  
	  // Fetch logs
	  const taIDs = deviceData?.map((d) => d.taID)

	  const { data: logsData } = await supabase
	    .from('logs')
	    .select('*')
	    .in('UniID', taIDs || [])
		
	  const latestLogsByUniID = logsData?.reduce((acc, log) => {
	  const existing = acc[log.UniID]
	  if (!existing || new Date(log.Date) > new Date(existing.Date)) {
		acc[log.UniID] = log
	  }
	  return acc
	}, {} as Record<string, any>)
	
   	  const devicesWithLogs = deviceData?.map((device) => ({
	    ...device,
	    latestLog: latestLogsByUniID[device.taID] || null,
	  }))

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
            <tbody>
			  {devicesWithLogs.map((device) => (
				<tr key={device.id}>
				  <td>{device["Hostname"]}</td>
				  <td>{device["OS"]}</td>
				  <td>{device["Model"]}</td>
				  <td>{device.latestLog?["Q_Total"] ?? 'N/A'}</td>
				  <td>{device.latestLog?["Q_Perv"] ?? 'N/A'}</td>
				</tr>
			  ))}
			</tbody>
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
