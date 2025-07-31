// app/admin/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import OrdersTable from '@/components/admin-orders'
import AdminTicketsTable from '@/components/AdminTicketsTable'
import DeviceDetailsModal from '@/components/DeviceDetailsModal'

import { DeviceWithLog, DeviceList, DeviceGroup, DeviceClient } from '@/types'

type LogEntry = {
  UniID: string
  Date: string
  Q_Total?: string
  Q_Perc?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState<boolean>(false)

  const [devicesWithLogs, setDevicesWithLogs] = useState<DeviceWithLog[]>([])
  const [selectedDevice, setSelectedDevice] = useState<DeviceWithLog | null>(null)
  const [modalData, setModalData] = useState<{
    lists: DeviceList[]
    groups: DeviceGroup[]
    clients: DeviceClient[]
  }>({ lists: [], groups: [], clients: [] })

  // Auth check
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      const role = user.user_metadata?.role
      if (role === 'admin') {
        setAuthorized(true)
      } else {
        router.push('/')
      }
    }

    checkAdmin()
  }, [router])

  // Devices fetch
  useEffect(() => {
    const fetchDevices = async () => {
      const { data: devices } = await supabase
        .from('devices')
        .select('*')
        .eq('OS', 'linux') // optional filter

      const taIDs = devices?.map((d) => d.taID) || []

      let logsData: LogEntry[] = []
      if (taIDs.length > 0) {
        const { data: logs } = await supabase
          .from('logs')
          .select('*')
          .in('UniID', taIDs)

        logsData = logs ?? []
      }

      const latestLogsByUniID = logsData.reduce((acc, log) => {
        const existing = acc[log.UniID]
        if (!existing || new Date(log.Date) > new Date(existing.Date)) {
          acc[log.UniID] = log
        }
        return acc
      }, {} as Record<string, LogEntry>)

      const withLogs = devices?.map((device) => ({
        ...device,
        latestLog: latestLogsByUniID[device.taID] || null,
      }))

      setDevicesWithLogs(withLogs || [])
    }

    fetchDevices()
  }, [])

  // Open Modal
  const openModal = async (device: DeviceWithLog) => {
    const [listsRes, groupsRes, clientsRes] = await Promise.all([
      supabase.from('device_lists').select('comment, groups, type').eq('device', device.taID),
      supabase.from('device_groups').select('name, comment, pi_id').eq('device', device.taID),
      supabase.from('device_clients').select('name, client, groups, cli_id').eq('device', device.taID),
    ])

    const normalizeGroups = (groups: unknown): number[] => {
      if (Array.isArray(groups)) {
        return groups.map((g) => (typeof g === 'string' ? parseInt(g) : g))
      }
      if (typeof groups === 'string') {
        try {
          const parsed = JSON.parse(groups)
          return Array.isArray(parsed) ? parsed.map((g) => parseInt(g)) : []
        } catch {
          return []
        }
      }
      if (typeof groups === 'number') return [groups]
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

  const closeModal = () => setSelectedDevice(null)

  if (!authorized) return <p className="p-6">Loading...</p>

  return (
    <main className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Orders */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Orders</h2>
        <OrdersTable />
      </section>

      {/* Tickets */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Support Tickets</h2>
        <AdminTicketsTable />
      </section>

      {/* Devices */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Devices</h2>
        {devicesWithLogs.length === 0 ? (
          <p>No devices found.</p>
        ) : (
          <table className="table-auto w-full border-collapse border text-center text-white rounded-lg bg-blue-600">
            <thead>
              <tr>
                <th className="border px-4 py-2">Hostname</th>
                <th className="border px-4 py-2">Owner</th>
                <th className="border px-4 py-2">OS</th>
                <th className="border px-4 py-2">Model</th>
                <th className="border px-4 py-2">Queries</th>
                <th className="border px-4 py-2">Blocked</th>
                <th className="border px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {devicesWithLogs.map((device) => (
                <tr key={device.taID}>
                  <td className="border px-4 py-2">{device.Hostname}</td>
                  <td className="border px-4 py-2">{device.Owner}</td>
                  <td className="border px-4 py-2">{device.OS}</td>
                  <td className="border px-4 py-2">{device.Model}</td>
                  <td className="border px-4 py-2">{device.latestLog?.Q_Total || 'N/A'}</td>
                  <td className="border px-4 py-2">{device.latestLog?.Q_Perc || 'N/A'}</td>
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
