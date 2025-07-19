import { useEffect, useState } from 'react'

interface AdminOrder {
  id: string
  email: string | null
  amount: string
  currency: string
  created: string
  items: string
  supabaseStatus: string
}

function OrdersTable() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(data.orders)
      setLoading(false)
    }

    fetchOrders()
  }, [])

  if (loading) return <p>Loading orders...</p>

  return (
    <table className="table-auto w-full text-sm border-collapse border mt-4">
      <thead>
        <tr className="bg-gray-100 text-black">
          <th className="border px-2 py-1">Charge ID</th>
          <th className="border px-2 py-1">Email</th>
          <th className="border px-2 py-1">Amount</th>
          <th className="border px-2 py-1">Created</th>
          <th className="border px-2 py-1">Items</th>
          <th className="border px-2 py-1">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td className="border px-2 py-1">{order.id}</td>
            <td className="border px-2 py-1">{order.email}</td>
            <td className="border px-2 py-1">
              {order.amount} {order.currency.toUpperCase()}
            </td>
            <td className="border px-2 py-1">{order.created}</td>
            <td className="border px-2 py-1">{order.items}</td>
            <td className="border px-2 py-1">{order.supabaseStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OrdersTable
