'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type OrderWithStatus = {
  id: string
  amount: number
  currency: string
  created_at: string
  status: string
  description: string
  user_email: string
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<OrderWithStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('orders_with_status') // ✅ query the view
        .select('*')

      if (error) {
        console.error('Error fetching orders:', error)
      } else {
        setOrders(data || [])
      }

      setLoading(false)
    }

    fetchOrders()
  }, [])

  if (loading) return <p>Loading orders...</p>

  return (
    <table className="w-full table-auto border-collapse border text-sm mt-4">
      <thead>
        <tr>
          <th className="border px-4 py-2">Order ID</th>
          <th className="border px-4 py-2">User</th>
          <th className="border px-4 py-2">Amount</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">Description</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="border px-4 py-2">{order.id}</td>
            <td className="border px-4 py-2">{order.user_email}</td>
            <td className="border px-4 py-2">£{order.amount.toFixed(2)}</td>
            <td className="border px-4 py-2">{order.status || 'Unknown'}</td>
            <td className="border px-4 py-2">
              {new Date(order.created_at).toLocaleDateString()}
            </td>
            <td className="border px-4 py-2">{order.description || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
