import { useApp } from '@/context/AppContext';

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex-1 bg-gray-100 rounded-full overflow-hidden h-2">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.round((value / max) * 100)}%` }} />
    </div>
  );
}

export default function AdminAnalytics() {
  const { state } = useApp();

  const completedOrders = state.orders.filter(o => o.status === 'delivered' || o.status === 'shipped');
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = completedOrders.length ? Math.round(totalRevenue / completedOrders.length) : 0;

  const categoryRevenue = ['sanitary', 'hardware', 'surgical', 'household'].map(cat => {
    const products = state.products.filter(p => p.category === cat);
    const revenue = products.reduce((s, p) => s + p.salePrice * p.reviews, 0);
    return { cat, revenue, products: products.length };
  });
  const maxRevenue = Math.max(...categoryRevenue.map(c => c.revenue));

  const topProducts = [...state.products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  const monthlyData = [
    { month: 'Mar', value: 28 },
    { month: 'Apr', value: 35 },
    { month: 'May', value: 42 },
    { month: 'Jun', value: 38 },
    { month: 'Jul', value: 55 },
    { month: 'Aug', value: 68 },
  ];
  const maxMonth = Math.max(...monthlyData.map(m => m.value));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-heading">Analytics</h1>
        <p className="text-gray-500 text-sm">Store performance overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `Rs. ${(totalRevenue / 1000).toFixed(1)}K`, sub: 'From shipped/delivered orders', icon: '💰', color: 'from-emerald-500 to-teal-600' },
          { label: 'Total Orders', value: state.orders.length, sub: `${state.orders.filter(o => o.status === 'pending').length} pending`, icon: '📦', color: 'from-blue-500 to-indigo-600' },
          { label: 'Avg. Order Value', value: `Rs. ${avgOrderValue.toLocaleString()}`, sub: 'Per completed order', icon: '📊', color: 'from-purple-500 to-violet-600' },
          { label: 'Products', value: state.products.length, sub: `${state.products.filter(p => p.status === 'in-stock').length} in stock`, icon: '🛍️', color: 'from-orange-500 to-amber-600' },
        ].map(card => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/70 text-xs font-medium uppercase tracking-wider">{card.label}</span>
              <span className="text-xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold font-heading">{card.value}</p>
            <p className="text-white/70 text-xs mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue chart (visual bars) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Monthly Revenue Trend</h2>
          <p className="text-xs text-gray-400 mb-5">Relative sales volume (last 6 months)</p>
          <div className="flex items-end gap-2 h-40">
            {monthlyData.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-700"
                  style={{ height: `${(m.value / maxMonth) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 font-medium">
            <span>↑ 23.6%</span>
            <span className="text-gray-400">vs last period</span>
          </div>
        </div>

        {/* Revenue by category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-5">Revenue by Category</h2>
          <div className="space-y-4">
            {categoryRevenue.map((cat, i) => {
              const icons = ['🚿', '🔧', '⚕️', '🏠'];
              const colors = ['bg-blue-500', 'bg-amber-500', 'bg-teal-500', 'bg-emerald-500'];
              const pct = maxRevenue > 0 ? Math.round((cat.revenue / maxRevenue) * 100) : 0;
              return (
                <div key={cat.cat}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{icons[i]}</span>
                      <span className="text-sm font-medium text-gray-700 capitalize">{cat.cat}</span>
                    </div>
                    <span className="text-xs text-gray-500">{pct}%</span>
                  </div>
                  <MiniBar value={cat.revenue} max={maxRevenue} color={colors[i]} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top products + Order status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white ${['bg-amber-500', 'bg-gray-400', 'bg-orange-600', 'bg-blue-400', 'bg-purple-400'][i]}`}>{i + 1}</div>
                <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.reviews} reviews</p>
                </div>
                <p className="text-sm font-bold text-gray-900 shrink-0">Rs. {p.salePrice.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {[
              { status: 'delivered', label: 'Delivered', color: 'bg-emerald-500', colorLight: 'bg-emerald-100 text-emerald-700' },
              { status: 'shipped', label: 'Shipped', color: 'bg-indigo-500', colorLight: 'bg-indigo-100 text-indigo-700' },
              { status: 'processing', label: 'Processing', color: 'bg-purple-500', colorLight: 'bg-purple-100 text-purple-700' },
              { status: 'confirmed', label: 'Confirmed', color: 'bg-blue-500', colorLight: 'bg-blue-100 text-blue-700' },
              { status: 'pending', label: 'Pending', color: 'bg-amber-500', colorLight: 'bg-amber-100 text-amber-700' },
              { status: 'cancelled', label: 'Cancelled', color: 'bg-red-400', colorLight: 'bg-red-100 text-red-600' },
            ].map(({ status, label, color, colorLight }) => {
              const count = state.orders.filter(o => o.status === status).length;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-24 text-center ${colorLight}`}>{label}</span>
                  <MiniBar value={count} max={state.orders.length || 1} color={color} />
                  <span className="text-sm font-bold text-gray-900 w-6 text-right shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
