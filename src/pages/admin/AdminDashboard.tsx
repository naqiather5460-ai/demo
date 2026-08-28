import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

function StatCard({ title, value, sub, icon, color, to }: { title: string; value: string | number; sub: string; icon: string; color: string; to?: string }) {
  const content = (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all ${to ? 'hover:border-blue-100 cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 font-heading mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

export default function AdminDashboard() {
  const { state } = useApp();

  const totalRevenue = state.orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
  const lowStock = state.products.filter(p => p.status === 'low-stock').length;
  const soldOut = state.products.filter(p => p.status === 'sold-out').length;
  const outOfStock = state.products.filter(p => p.status === 'out-of-stock').length;

  const recentOrders = state.orders.slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    'out-for-delivery': 'bg-orange-100 text-orange-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const topProducts = [...state.products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-heading">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {state.currentUser?.name}. Here's what's happening.</p>
        </div>
        <Link to="/admin/products/add" className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors">
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`Rs. ${(totalRevenue / 1000).toFixed(1)}K`} sub="From completed orders" icon="💰" color="bg-emerald-100" to="/admin/analytics" />
        <StatCard title="Total Orders" value={state.orders.length} sub={`${pendingOrders} pending review`} icon="📦" color="bg-blue-100" to="/admin/orders" />
        <StatCard title="Products" value={state.products.length} sub={`${lowStock} low stock`} icon="🛍️" color="bg-purple-100" to="/admin/products" />
        <StatCard title="Customers" value="50K+" sub="Registered customers" icon="👥" color="bg-orange-100" to="/admin/customers" />
      </div>

      {/* Alerts */}
      {(soldOut > 0 || lowStock > 0 || outOfStock > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {soldOut > 0 && (
            <Link to="/admin/inventory" className="flex items-center gap-3 p-3.5 bg-gray-100 border border-gray-200 rounded-2xl hover:bg-gray-200 transition-colors">
              <span className="text-lg">⚫</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{soldOut} Sold Out</p>
                <p className="text-xs text-gray-500">Products need restocking</p>
              </div>
            </Link>
          )}
          {lowStock > 0 && (
            <Link to="/admin/inventory" className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="text-sm font-bold text-amber-800">{lowStock} Low Stock</p>
                <p className="text-xs text-amber-600">Running low on inventory</p>
              </div>
            </Link>
          )}
          {outOfStock > 0 && (
            <Link to="/admin/inventory" className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl hover:bg-red-100 transition-colors">
              <span className="text-lg">🔴</span>
              <div>
                <p className="text-sm font-bold text-red-800">{outOfStock} Out of Stock</p>
                <p className="text-xs text-red-600">No inventory available</p>
              </div>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-purple-600 font-medium hover:text-purple-800">View All →</Link>
          </div>
          <div className="space-y-2.5">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                  {order.customerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{order.customerName}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{order.id}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${statusColors[order.status] || 'bg-gray-100'}`}>
                  {order.status.replace('-', ' ')}
                </span>
                <span className="text-xs font-bold text-gray-900 shrink-0">Rs. {(order.total / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Top Selling Products</h2>
            <Link to="/admin/products" className="text-xs text-purple-600 font-medium hover:text-purple-800">Manage →</Link>
          </div>
          <div className="space-y-2.5">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.reviews} reviews • {p.brand}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-gray-900">Rs. {p.salePrice.toLocaleString()}</p>
                  <p className="text-[11px]" style={{ color: p.status === 'in-stock' ? '#10b981' : p.status === 'low-stock' ? '#f59e0b' : '#ef4444' }}>
                    {p.status === 'in-stock' ? '●' : p.status === 'low-stock' ? '●' : '●'} {p.status.replace('-', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-6 text-white">
        <h2 className="font-bold mb-4 text-sm">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Product', icon: '➕', to: '/admin/products/add', color: 'bg-purple-600 hover:bg-purple-700' },
            { label: 'View Orders', icon: '📋', to: '/admin/orders', color: 'bg-blue-600 hover:bg-blue-700' },
            { label: 'Inventory', icon: '📦', to: '/admin/inventory', color: 'bg-indigo-600 hover:bg-indigo-700' },
            { label: 'Create Coupon', icon: '🏷️', to: '/admin/discounts', color: 'bg-teal-600 hover:bg-teal-700' },
          ].map(action => (
            <Link key={action.label} to={action.to} className={`flex flex-col items-center gap-2 p-3 rounded-xl text-sm font-semibold text-white ${action.color} transition-colors`}>
              <span className="text-xl">{action.icon}</span>
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
