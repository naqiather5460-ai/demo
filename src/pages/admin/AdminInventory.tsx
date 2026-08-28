import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { ProductStatus } from '@/data/mockData';

export default function AdminInventory() {
  const { state, dispatch, showNotification } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = state.products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const matchFilter =
      filter === 'all' ? true :
      filter === 'low-stock' ? p.status === 'low-stock' :
      filter === 'out-of-stock' ? p.status === 'out-of-stock' :
      filter === 'sold-out' ? p.status === 'sold-out' :
      filter === 'in-stock' ? p.status === 'in-stock' : true;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: state.products.length,
    inStock: state.products.filter(p => p.status === 'in-stock').length,
    lowStock: state.products.filter(p => p.status === 'low-stock').length,
    outOfStock: state.products.filter(p => p.status === 'out-of-stock').length,
    soldOut: state.products.filter(p => p.status === 'sold-out').length,
  };

  const updateStock = (id: string, stock: number, status: ProductStatus) => {
    dispatch({ type: 'UPDATE_PRODUCT_STATUS', payload: { id, status, stock } });
    showNotification('Stock updated');
  };

  const restock = (id: string) => {
    dispatch({ type: 'UPDATE_PRODUCT_STATUS', payload: { id, status: 'in-stock', stock: 50 } });
    showNotification('Product restocked to 50 units');
  };

  const markSoldOut = (id: string) => {
    dispatch({ type: 'UPDATE_PRODUCT_STATUS', payload: { id, status: 'sold-out', stock: 0 } });
    showNotification('Product marked as Sold Out. Customers will see "Currently Unavailable".');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-heading">Inventory Management</h1>
        <p className="text-gray-500 text-sm">Manage stock levels and product availability</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700', filter: 'all' },
          { label: 'In Stock', value: stats.inStock, color: 'bg-emerald-100 text-emerald-700', filter: 'in-stock' },
          { label: 'Low Stock', value: stats.lowStock, color: 'bg-amber-100 text-amber-700', filter: 'low-stock' },
          { label: 'Out of Stock', value: stats.outOfStock, color: 'bg-red-100 text-red-700', filter: 'out-of-stock' },
          { label: 'Sold Out', value: stats.soldOut, color: 'bg-gray-200 text-gray-600', filter: 'sold-out' },
        ].map(stat => (
          <button
            key={stat.label}
            onClick={() => setFilter(stat.filter)}
            className={`p-3 rounded-2xl text-center transition-all hover:shadow-md ${stat.color} ${filter === stat.filter ? 'ring-2 ring-offset-2 ring-purple-500 shadow-md' : ''}`}
          >
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Critical alerts */}
      {(stats.lowStock > 0 || stats.soldOut > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">⚠️</span>
            <h3 className="font-semibold text-amber-800 text-sm">Inventory Alerts</h3>
          </div>
          <p className="text-amber-700 text-sm">
            {stats.lowStock > 0 && `${stats.lowStock} product${stats.lowStock > 1 ? 's' : ''} running low. `}
            {stats.soldOut > 0 && `${stats.soldOut} product${stats.soldOut > 1 ? 's' : ''} sold out and currently unavailable to customers.`}
          </p>
        </div>
      )}

      {/* Search + Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-0">
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {['Product', 'SKU', 'Category', 'Stock', 'Status', 'Quick Actions'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(product => {
                const stockColor = product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-red-500' : product.stock <= 20 ? 'text-amber-600' : 'text-emerald-600';
                const statusColor = {
                  'in-stock': 'bg-emerald-100 text-emerald-700',
                  'low-stock': 'bg-amber-100 text-amber-700',
                  'out-of-stock': 'bg-red-100 text-red-700',
                  'sold-out': 'bg-gray-200 text-gray-600',
                  'draft': 'bg-gray-100 text-gray-500',
                  'published': 'bg-blue-100 text-blue-700',
                }[product.status] || 'bg-gray-100';

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={product.image} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3"><span className="text-xs font-mono text-gray-500">{product.sku}</span></td>
                    <td className="py-3 px-3"><span className="text-xs text-gray-600 capitalize">{product.category}</span></td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={product.stock}
                          min={0}
                          onBlur={e => {
                            const newStock = +e.target.value;
                            const newStatus: ProductStatus = newStock === 0 ? 'out-of-stock' : newStock <= 10 ? 'low-stock' : 'in-stock';
                            if (newStock !== product.stock) updateStock(product.id, newStock, newStatus);
                          }}
                          className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className={`text-xs font-bold ${stockColor}`}>units</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize whitespace-nowrap ${statusColor}`}>
                        {product.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => restock(product.id)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          ↑ Restock
                        </button>
                        <button
                          onClick={() => markSoldOut(product.id)}
                          disabled={product.status === 'sold-out'}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 whitespace-nowrap"
                        >
                          Mark Sold Out
                        </button>
                        <Link to={`/admin/products/edit/${product.id}`} className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
