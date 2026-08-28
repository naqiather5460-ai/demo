import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { OrderStatus } from '@/data/mockData';

const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'];

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  'out-for-delivery': 'bg-orange-100 text-orange-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

const paymentLabels: Record<string, string> = {
  'cash-on-delivery': 'Cash on Delivery',
  'credit-card': 'Credit Card',
  'bank-transfer': 'Bank Transfer',
  'digital-wallet': 'Digital Wallet',
};

export default function AdminOrders() {
  const { state, dispatch, showNotification } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filtered = state.orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const order = selectedOrder ? state.orders.find(o => o.id === selectedOrder) : null;

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: orderId, status } });
    showNotification(`Order status updated to "${status.replace('-', ' ')}"`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-heading">Orders</h1>
          <p className="text-gray-500 text-sm">{state.orders.length} total orders</p>
        </div>
        <div className="flex gap-2 text-xs">
          {Object.entries({ pending: 'Pending', processing: 'Processing', shipped: 'Shipped' }).map(([k, l]) => (
            <span key={k} className={`px-2.5 py-1 rounded-lg font-semibold ${statusColors[k as OrderStatus]}`}>
              {state.orders.filter(o => o.status === k).length} {l}
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, customer name..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
          <option value="">All Statuses</option>
          {statusOptions.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="text-xs font-mono font-bold text-gray-900">{order.id}</p>
                    <p className="text-[11px] text-gray-400">{order.trackingNumber}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex -space-x-1">
                      {order.items.slice(0, 3).map(item => (
                        <img key={item.productId} src={item.image} alt="" className="w-7 h-7 rounded-lg object-cover border-2 border-white" title={item.name} />
                      ))}
                      {order.items.length > 3 && <div className="w-7 h-7 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">+{order.items.length - 3}</div>}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-bold text-gray-900">Rs. {order.total.toLocaleString()}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-gray-600">{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-gray-600">{new Date(order.placedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</p>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none ${statusColors[order.status]}`}
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => setSelectedOrder(order.id)} className="text-xs text-purple-600 hover:text-purple-800 font-medium hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">No orders found</p>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {order && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 font-mono">{order.id}</h3>
                <p className="text-xs text-gray-400">{new Date(order.placedAt).toLocaleDateString('en-PK', { dateStyle: 'long' })}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</h4>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <p className="text-sm font-semibold">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.customerEmail}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                  <p className="text-xs text-gray-700">{order.address.street}</p>
                  <p className="text-xs text-gray-700">{order.address.city} {order.address.postalCode}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−Rs. {order.discount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.delivery === 0 ? 'Free' : `Rs. ${order.delivery}`}</span></div>
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>Rs. {order.total.toLocaleString()}</span></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s.replace('-', ' ')}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
