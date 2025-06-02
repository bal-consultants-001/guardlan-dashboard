//dashboard page

'use client'

type Order = {
  id: string
  status: string
  // Add more fields as needed
}

/*type Device = {
  "Hostname": string
  "OS": string
  "Model": string
  Q_Total: string
  Q_Perc: string
  taID: string
  // Add more fields as needed
}*/

type Ticket = {
  ticket_no: string
  status: string
  // Add more fields as needed
}

type LogEntry = {
  UniID: string
  Date: string
  Q_Total?: string
  Q_Perc?: string
  // Add more fields from the logs table as needed
}




import DeviceDetailsModal from "@/components/DeviceDetailsModal"; // adjust path as needed
import {DeviceWithLog, DeviceList, DeviceGroup, DeviceClient } from "@/types";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  //const [devices, setDevices] = useState<Device[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [devicesWithLogs, setDevicesWithLogs] = useState<DeviceWithLog[]>([])
  const [selectedDevice, setSelectedDevice] = useState<DeviceWithLog | null>(null);
  const [modalData, setModalData] = useState<{
	lists: DeviceList[];
	groups: DeviceGroup[];
	clients: DeviceClient[];
  }>({
	lists: [],
	groups: [],
	clients: [],
  });
  
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

      // Fetch orders
      const { data: orderData, error: orderError} = await supabase
        .from('orders')
        .select('*')
        .eq('id', userId)
	  console.log('Orders data:', orderData, 'Orders error:', orderError)
      setOrders(orderData || [])

      // Fetch devices
      const { data: deviceData, error: deviceError } = await supabase
        .from('devices')
        .select('*')
        .eq('"Owner"', userId)
		.eq('"OS"', 'linux')
	  console.log('Devices data:', deviceData, 'Devices error:', deviceError)
      //setDevices(deviceData || [])
	  
	  // Fetch logs
	  const taIDs = deviceData?.map((d) => d.taID) || []
      console.log('Extracted taIDs:', taIDs)

	  const allLogs = await supabase
		  .from('logs')
		  .select('*')
		console.log('All logs:', allLogs)

	  let logsData = []
	  let logsError = null
	  if (taIDs.length > 0) {
		const logsResponse = await supabase
		  .from('logs')
		  .select('*')
		  .in('"UniID"', taIDs)

		logsData = logsResponse.data ?? []
		logsError = logsResponse.error
		console.log('Logs data:', logsData, 'Logs error:', logsError)
	  } else {
		console.log('No taIDs found, skipping logs fetch.')
	  }
		
	  const latestLogsByUniID = logsData?.reduce((acc, log) => {
	  const existing = acc[log.UniID]
	  if (!existing || new Date(log.Date) > new Date(existing.Date)) {
		acc[log.UniID] = log
	  }
	  return acc
	}, {} as Record<string, LogEntry>)
	
   	  const devicesWithLogs = deviceData?.map((device) => ({
	    ...device,
	    latestLog: latestLogsByUniID[device.taID] || null,
	  }))
	  
	  setDevicesWithLogs(devicesWithLogs || [])

      // Fetch tickets
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', userId)
      setTickets(ticketData || [])
    };

    fetchData()
  }, [router])
  
	const openModal = async (device: DeviceWithLog) => {
	  const { supabase } = await import('@/lib/supabase');

	  const [listsRes, groupsRes, clientsRes] = await Promise.all([
		supabase.from("device_lists").select("comment, groups, type").eq("device", device.taID),
		supabase.from("device_groups").select("name, comment, pi_id").eq("device", device.taID),
		supabase.from("device_clients").select("name, client, groups, cli_id").eq("device", device.taID),
	  ]);

	  const normalizeGroups = (groups: any): number[] => {
		if (Array.isArray(groups)) {
		  return groups.map((g) => typeof g === 'string' ? parseInt(g) : g);
		}
		if (typeof groups === 'string') {
		  try {
			const parsed = JSON.parse(groups);
			return Array.isArray(parsed) ? parsed.map((g) => parseInt(g)) : [];
		  } catch {
			return [];
		  }
		}
		if (typeof groups === 'number') {
		  return [groups];
		}
		return [];
	  };

	  const normalizedLists = (listsRes.data ?? []).map((list) => ({
		...list,
		groups: normalizeGroups(list.groups),
	  }));

	  const normalizedClients = (clientsRes.data ?? []).map((client) => ({
		...client,
		groups: normalizeGroups(client.groups),
	  }));

	  setModalData({
		lists: normalizedLists,
		groups: (groupsRes.data ?? []) as DeviceGroup[],
		clients: normalizedClients,
	  });

	  setSelectedDevice(device);
	};


  if (!user) return <p>Loading dashboard...</p>

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
		  {devicesWithLogs.length === 0 ? (
			<p>No active devices.</p>
		  ) : (
			<table className="table-auto w-full border border-collapse mt-4">
			  <thead>
				<tr>
				  <th className="border px-4 py-2">Hostname</th>
				  <th className="border px-4 py-2">OS</th>
				  <th className="border px-4 py-2">Model</th>
				  <th className="border px-4 py-2">Queries</th>
				  <th className="border px-4 py-2">Blocked</th>
				</tr>
			  </thead>
			  <tbody>
				{devicesWithLogs.map((device) => (
				  <tr key={device.taID}>
					<td>
					  <button
						className="text-blue-600 hover:underline"
						onClick={() => openModal(device)}
					  >
						{device["Hostname"]}
					  </button>
					</td>
					{/*<td className="border px-4 py-2">{device["Hostname"]}</td>*/}
					<td className="border px-4 py-2">{device["OS"]}</td>
					<td className="border px-4 py-2">{device["Model"]}</td>
					<td className="border px-4 py-2">{device.latestLog?.["Q_Total"] ?? 'N/A'}</td>
					<td className="border px-4 py-2">{device.latestLog?.["Q_Perc"] ?? 'N/A'}</td>
				  </tr>
				))}
			  </tbody>
			</table>
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
	  {selectedDevice && (
	  <DeviceDetailsModal
		device={selectedDevice}
		data={modalData}
		onClose={closeModal}
	  />
	)}
    </main>
  )
}
