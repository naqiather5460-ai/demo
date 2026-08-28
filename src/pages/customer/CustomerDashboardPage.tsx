import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  'out-for-delivery': 'bg-orange-100 text-orange-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function CustomerDashboardPage() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'profile'>('overview');

  const myOrders = state.orders.slice(0, 3);
  const wishlistCount = state.wishlist.length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: 'orders', label: 'My Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'wishlist', label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold font-heading">
              {state.currentUser?.name[0] || 'G'}
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading">{state.currentUser?.name || 'Guest'}</h1>
              <p className="text-blue-200 text-sm">{state.currentUser?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { label: 'Total Orders', value: myOrders.length },
              { label: 'Wishlist Items', value: wishlistCount },
              { label: 'Saved Addresses', value: 1 },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-2xl p-3 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-blue-200 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Sidebar */}
          <aside className="sm:w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-3 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === tab.id ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
              <div className="border-t border-gray-100 pt-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
                  <div className="space-y-3">
                    {myOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-mono text-sm font-medium text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''} • {new Date(order.placedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status.replace('-', ' ')}</span>
                          <Link to={`/track/${order.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Track →</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/wishlist" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-red-100 transition-all group">
                    <div className="text-red-500 text-2xl mb-2">❤️</div>
                    <div className="font-semibold text-gray-900">{wishlistCount} Saved Items</div>
                    <div className="text-xs text-gray-500 mt-0.5">View your wishlist →</div>
                  </Link>
                  <Link to="/shop" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all group">
                    <div className="text-blue-500 text-2xl mb-2">🛍️</div>
                    <div className="font-semibold text-gray-900">Continue Shopping</div>
                    <div className="text-xs text-gray-500 mt-0.5">Browse all products →</div>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4">All Orders</h2>
                <div className="space-y-3">
                  {state.orders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-mono text-sm font-bold text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{new Date(order.placedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status.replace('-', ' ')}</span>
                          <Link to={`/track/${order.id}`} className="text-xs text-blue-600 font-medium">Track</Link>
                        </div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {order.items.map(item => (
                          <img key={item.productId} src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" title={item.name} />
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                        <span className="font-bold text-gray-900 text-sm">Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-5">Profile Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: state.currentUser?.name || '', placeholder: 'Your name' },
                    { label: 'Email', value: state.currentUser?.email || '', placeholder: 'your@email.com' },
                    { label: 'Phone', value: '+92 300 0000000', placeholder: 'Phone number' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{field.label}</label>
                      <input defaultValue={field.value} placeholder={field.placeholder} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                  <button className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-900">Saved Addresses</h2>
                  <button className="text-sm text-blue-600 font-medium">+ Add New</button>
                </div>
                <div className="border-2 border-blue-100 rounded-xl p-4 bg-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded uppercase mb-2 inline-block">Default</span>
                      <p className="font-semibold text-gray-900 text-sm">{state.currentUser?.name}</p>
                      <p className="text-gray-600 text-xs">45-B Model Town, Lahore 54000</p>
                      <p className="text-gray-600 text-xs">+92 300 1234567</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Saved Products ({wishlistCount})</h2>
                {wishlistCount === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">❤️</div>
                    <p>No saved products yet</p>
                    <Link to="/shop" className="text-sm text-blue-600 mt-2 inline-block">Browse Shop →</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {state.products.filter(p => state.wishlist.includes(p.id)).map(p => (
                      <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 line-clamp-2">{p.name}</p>
                          <p className="text-xs text-blue-700 font-bold">Rs. {p.salePrice.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
