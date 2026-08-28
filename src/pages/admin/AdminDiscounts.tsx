import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { DiscountCode } from '@/data/mockData';

export default function AdminDiscounts() {
  const { state, dispatch, showNotification } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: 10, minOrder: 0, maxUses: 100, expiresAt: '', categories: [] as string[] });

  const handleCreate = () => {
    if (!form.code || !form.expiresAt) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    const newCode: DiscountCode = {
      id: `dc-${Date.now()}`,
      code: form.code.toUpperCase(),
      type: form.type as 'percentage' | 'fixed',
      value: form.value,
      minOrder: form.minOrder,
      maxUses: form.maxUses,
      usedCount: 0,
      expiresAt: form.expiresAt,
      status: 'active',
      categories: form.categories,
    };
    dispatch({ type: 'ADD_DISCOUNT_CODE', payload: newCode });
    showNotification(`Coupon "${newCode.code}" created successfully!`);
    setShowForm(false);
    setForm({ code: '', type: 'percentage', value: 10, minOrder: 0, maxUses: 100, expiresAt: '', categories: [] });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    dispatch({ type: 'UPDATE_DISCOUNT_CODE', payload: { id, status: newStatus as 'active' | 'inactive' | 'expired' } });
    showNotification(`Coupon ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const deleteCode = (id: string) => {
    dispatch({ type: 'DELETE_DISCOUNT_CODE', payload: id });
    showNotification('Coupon deleted');
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-500',
    expired: 'bg-red-100 text-red-600',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-heading">Discounts & Coupons</h1>
          <p className="text-gray-500 text-sm">{state.discountCodes.filter(d => d.status === 'active').length} active coupons</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Create New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.discountCodes.map(code => {
          const usagePct = Math.round((code.usedCount / code.maxUses) * 100);
          return (
            <div key={code.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-gray-900 text-lg tracking-widest">{code.code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[code.status]}`}>{code.status}</span>
                  </div>
                  <div className="text-sm font-semibold text-blue-700">
                    {code.type === 'percentage' ? `${code.value}% off` : `Rs. ${code.value} off`}
                  </div>
                </div>
                <div className="text-2xl">🏷️</div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                <div className="flex justify-between">
                  <span>Min. Order</span>
                  <span className="text-gray-700 font-medium">Rs. {code.minOrder.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expires</span>
                  <span className="text-gray-700 font-medium">{code.expiresAt}</span>
                </div>
                {code.categories.length > 0 && (
                  <div className="flex justify-between">
                    <span>Categories</span>
                    <span className="text-gray-700 font-medium capitalize">{code.categories.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Usage</span>
                  <span className="font-medium text-gray-700">{code.usedCount} / {code.maxUses}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${usagePct >= 80 ? 'bg-red-500' : usagePct >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${usagePct}%` }} />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(code.id, code.status)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${code.status === 'active' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                >
                  {code.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteCode(code.id)} className="px-3 py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create coupon modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Create Coupon</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Coupon Code <span className="text-red-500">*</span></label>
                <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Discount Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Value {form.type === 'percentage' ? '(%)' : '(Rs.)'}</label>
                  <input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: +e.target.value }))} min={1} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Min. Order (Rs.)</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: +e.target.value }))} min={0} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: +e.target.value }))} min={1} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Expiry Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors">Create Coupon</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
