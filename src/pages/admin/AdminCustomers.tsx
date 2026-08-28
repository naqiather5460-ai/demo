import { useState } from 'react';
import { customers } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function AdminCustomers() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const selectedCustomer = selected ? customers.find(c => c.id === selected) : null;
  const customerOrders = selectedCustomer ? state.orders.filter(o => o.customerEmail === selectedCustomer.email) : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-heading">Customers</h1>
          <p className="text-gray-500 text-sm">{customers.length} registered customers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">50K+</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Customers</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{customers.filter(c => c.status === 'active').length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Active This Month</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">Rs. {(customers.reduce((s, c) => s + c.totalSpent, 0) / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Revenue</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers by name, email, or phone..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Customer', 'Contact', 'Orders', 'Total Spent', 'Joined', 'Status', ''].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">{customer.avatar}</div>
                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-xs text-gray-600">{customer.email}</p>
                  <p className="text-xs text-gray-400">{customer.phone}</p>
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-900">{customer.orders}</td>
                <td className="py-3 px-4 text-sm font-bold text-gray-900">Rs. {customer.totalSpent.toLocaleString()}</td>
                <td className="py-3 px-4 text-xs text-gray-500">{customer.joinedAt}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => setSelected(customer.id)} className="text-xs text-purple-600 hover:text-purple-800 font-medium">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer detail modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Customer Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">{selectedCustomer.avatar}</div>
                <div>
                  <p className="font-bold text-gray-900">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="font-bold text-gray-900">{selectedCustomer.orders}</p>
                  <p className="text-[11px] text-gray-500">Orders</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="font-bold text-gray-900 text-sm">Rs. {(selectedCustomer.totalSpent / 1000).toFixed(1)}K</p>
                  <p className="text-[11px] text-gray-500">Total Spent</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className={`font-bold ${selectedCustomer.status === 'active' ? 'text-emerald-600' : 'text-gray-500'}`}>{selectedCustomer.status}</p>
                  <p className="text-[11px] text-gray-500">Status</p>
                </div>
              </div>
              {customerOrders.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Orders</h4>
                  <div className="space-y-2">
                    {customerOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl text-sm">
                        <span className="font-mono text-xs text-gray-900">{order.id}</span>
                        <span className="text-xs font-bold">Rs. {order.total.toLocaleString()}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
