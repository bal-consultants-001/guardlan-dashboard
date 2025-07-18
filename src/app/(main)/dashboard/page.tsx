'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

import DeviceDetailsModal from '@/components/DeviceDetailsModal'
import TicketNotesModal from '@/components/TicketNotesModal'
import { DeviceWithLog, DeviceList, DeviceGroup, DeviceClient } from '@/types'

type Order = {
  id: string
  amount: number
  currency: string
  status: string
  date: string
  note?: string
  items?: string
}

type Ticket = {
  id: string
  ticket_no: string
  status: string
  short_desc?: string
  supp_user?: string
  engineerName?: string
}

type LogEntry = {
  UniID: string
  Date: string
  Q_Total?: string
  Q_Perc?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [fullName, setFullName] = useState<string | null>(null)
  const [devicesWithLogs, setDevicesWithLogs] = useState<DeviceWithLog[]>([])
  const [selectedDevice, setSelectedDevice] = useState<DeviceWithLog | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [modalData, setModalData] = useState<{
    lists: DeviceList[]
    groups: DeviceGroup[]
    clients: DeviceClient[]
  }>({
    lists: [],
    groups: [],
    clients: [],
  })

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

    // Devices
    const { data: deviceData } = await supabase
      .from('devices')
      .select('*')
      .eq('"Owner"', userId)
      .eq('"OS"', 'linux')

    const taIDs = deviceData?.map((d) => d.taID) || []

    let logsData: LogEntry[] = []
    if (taIDs.length > 0) {
      const logsResponse = await supabase
        .from('logs')
        .select('*')
        .in('"UniID"', taIDs)

      logsData = logsResponse.data ?? []
    }

    const latestLogsByUniID = logsData.reduce((acc, log) => {
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

    // Users map for ticket engineer names
    const { data: usersData } = await supabase
      .from('users')
      .select('uuid, firstname')

    const userMap = new Map<string, string>()
    usersData?.forEach((u) => {
      userMap.set(u.uuid, u.firstname)
    })

    // Tickets
    const { data: ticketData } = await supabase
      .from('tickets')
      .select('id, ticket_no, status, short_desc, supp_user')
      .eq('owner', userId)

    const mappedTickets = (ticketData || []).map((ticket) => ({
      ...ticket,
      engineerName: userMap.get(ticket.supp_user || '') || 'Unassigned',
    }))

    setTickets(mappedTickets)

    // Owner (Fullname + Stripe Customer ID)
    const { data: userData } = await supabase
      .from('owner')
      .select('"Fullname", stripe_customer_id')
      .eq('"ID"', userId)
      .single()

    if (userData) {
      setFullName(userData["Fullname"])
      const stripeCustomerId = userData.stripe_customer_id
      if (stripeCustomerId) {
        const ordersResponse = await fetch(`/api/stripe/orders?customer=${stripeCustomerId}`)
        const stripeOrders = await ordersResponse.json()
        setOrders(stripeOrders || [])
      }
    }
  }

  fetchData()
}, [router])


  const openModal = async (device: DeviceWithLog) => {
    const { supabase } = await import('@/lib/supabase')

    const [listsRes, groupsRes, clientsRes] = await Promise.all([
      supabase.from("device_lists").select("comment, groups, type").eq("device", device.taID),
      supabase.from("device_groups").select("name, comment, pi_id").eq("device", device.taID),
      supabase.from("device_clients").select("name, client, groups, cli_id").eq("device", device.taID),
    ])

    const normalizeGroups = (groups: unknown): number[] => {
      if (Array.isArray(groups)) {
        return groups.map((g) => typeof g === 'string' ? parseInt(g) : g)
      }
      if (typeof groups === 'string') {
        try {
          const parsed = JSON.parse(groups)
          return Array.isArray(parsed) ? parsed.map((g) => parseInt(g)) : []
        } catch {
          return []
        }
      }
      if (typeof groups === 'number') {
        return [groups]
      }
      return []
    }

    const normalizedLists = (listsRes.data ?? []).map((list) => ({
      ...list,
      groups: normalizeGroups(list.groups),
    }))

    const normalizedClients = (clientsRes.data ?? []).map((client) => ({
      ...client,
      groups: normalizeGroups(client.groups),
    }))

    setModalData({
      lists: normalizedLists,
      groups: (groupsRes.data ?? []) as DeviceGroup[],
      clients: normalizedClients,
    })

    setSelectedDevice(device)
  }

  const closeModal = () => {
    setSelectedDevice(null)
  }

  if (!user) return <p>Loading dashboard...</p>

  return (
    <>
      <h1 className="py-10 px-10 text-3xl font-bold mb-6">Welcome, {fullName || user.email}</h1>

      {/* Orders Section */}
      <section className="py-10 px-10 w-full">
        <h2 className="text-xl font-semibold mb-2">Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="table-auto w-full border-collapse border text-center text-white rounded-lg bg-blue-600">
            <thead>
              <tr>
                <th className="border px-4 py-2">Items</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border px-4 py-2">{order.items}</td>
                  <td className="border px-4 py-2">
                    £{order.amount}
                  </td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2">{order.date}</td>
                  <td className="border px-4 py-2">{order.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Devices Section */}
      <section className="py-10 px-10 w-full">
        <h2 className="text-xl font-semibold mb-2">Your Devices</h2>
        {devicesWithLogs.length === 0 ? (
          <p>No active devices.</p>
        ) : (
          <table className="table-auto w-full border-collapse border text-center text-white rounded-lg bg-blue-600">
            <thead>
              <tr>
                <th className="border px-4 py-2">Hostname</th>
                <th className="border px-4 py-2">OS</th>
                <th className="border px-4 py-2">Model</th>
                <th className="border px-4 py-2">Queries</th>
                <th className="border px-4 py-2">Blocked</th>
				<th className="border px-4 py-2">Configuration</th>
              </tr>
            </thead>
            <tbody>
              {devicesWithLogs.map((device) => (
                <tr key={device.taID}>
                  <td className="border px-4 py-2">{device["Hostname"]}</td>
                  <td className="border px-4 py-2">{device["OS"]}</td>
                  <td className="border px-4 py-2">{device["Model"]}</td>
                  <td className="border px-4 py-2">{device.latestLog?.["Q_Total"] ?? 'N/A'}</td>
                  <td className="border px-4 py-2">{device.latestLog?.["Q_Perc"] ?? 'N/A'}</td>
				  <td className="border px-4 py-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => openModal(device)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Tickets Section */}
      <section className="py-10 px-10 w-full">
        <h2 className="text-xl font-semibold mb-2">
          <Link href="/support" className="hover:text-gray-800">Support Tickets</Link>
        </h2>
        {tickets.length === 0 ? (
          <p>No support tickets yet.</p>
        ) : (
          <table className="table-auto w-full border-collapse border text-center text-white rounded-lg bg-blue-600">
            <thead>
              <tr>
                <th className="border px-4 py-2">Ticket No</th>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Engineer</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticket_no}>
                  <td className="border px-4 py-2">{ticket.ticket_no}</td>
                  <td className="border px-4 py-2">{ticket.short_desc || 'N/A'}</td>
                  <td className="border px-4 py-2">{ticket.status}</td>
                  <td className="border px-4 py-2">{ticket.engineerName}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
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

      {selectedDevice && (
        <DeviceDetailsModal
          device={selectedDevice}
          data={modalData}
          onClose={closeModal}
        />
      )}
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
