import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Product, ProductStatus, Category } from '@/data/mockData';

export default function AdminAddProduct() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, showNotification } = useApp();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const existing = isEdit ? state.products.find(p => p.id === id) : null;

  const [form, setForm] = useState({
    name: existing?.name || '',
    description: existing?.description || '',
    category: existing?.category || 'sanitary' as Category,
    subcategory: existing?.subcategory || '',
    brand: existing?.brand || '',
    price: existing?.price || 0,
    salePrice: existing?.salePrice || 0,
    stock: existing?.stock || 0,
    sku: existing?.sku || `SKU-${Date.now()}`,
    status: existing?.status || 'draft' as ProductStatus,
    featured: existing?.featured || false,
    isNew: existing?.isNew || false,
  });

  const [saving, setSaving] = useState(false);

  const update = (field: string, value: unknown) => setForm(p => ({ ...p, [field]: value }));
  const discount = form.price > 0 ? Math.round((1 - form.salePrice / form.price) * 100) : 0;

  const handleSave = (status?: ProductStatus) => {
    if (!form.name || !form.brand || !form.salePrice) {
      showNotification('Please fill in required fields', 'error');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (isEdit && existing) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: { id: existing.id, ...form, discount } });
        showNotification('Product updated successfully!');
      } else {
        const newProduct: Product = {
          id: `prod-${Date.now()}`,
          ...form,
          discount,
          rating: 0,
          reviews: 0,
          image: `https://images.unsplash.com/photo-1606676539940-12768ce0e762?w=600&h=600&fit=crop&auto=format&q=80`,
          images: [],
          specs: {},
          isBestSeller: false,
          tags: [form.category],
          status: status || form.status,
        };
        dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
        showNotification('Product added successfully!');
      }
      navigate('/admin/products');
    }, 600);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-heading">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-gray-500 text-sm">Fill in the details below</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Section title="Basic Information">
            <div className="space-y-3">
              <Field label="Product Name" required>
                <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Premium Chrome Faucet" className={inputCls} />
              </Field>
              <Field label="Product Description">
                <textarea rows={4} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Detailed product description..." className={`${inputCls} resize-none`} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Main Category" required>
                  <select value={form.category} onChange={e => update('category', e.target.value)} className={`${inputCls} bg-white`}>
                    <option value="sanitary">Sanitary Items</option>
                    <option value="hardware">Hardware & Tools</option>
                    <option value="surgical">Surgical & Medical</option>
                    <option value="household">Household Essentials</option>
                  </select>
                </Field>
                <Field label="Subcategory">
                  <input value={form.subcategory} onChange={e => update('subcategory', e.target.value)} placeholder="e.g. Faucets & Taps" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand" required>
                  <input value={form.brand} onChange={e => update('brand', e.target.value)} placeholder="e.g. AquaLux" className={inputCls} />
                </Field>
                <Field label="SKU">
                  <input value={form.sku} onChange={e => update('sku', e.target.value)} placeholder="e.g. AQL-FAU-001" className={inputCls} />
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Regular Price (Rs.)" required>
                <input type="number" value={form.price || ''} onChange={e => update('price', +e.target.value)} placeholder="12500" className={inputCls} min={0} />
              </Field>
              <Field label="Sale Price (Rs.)" required>
                <input type="number" value={form.salePrice || ''} onChange={e => update('salePrice', +e.target.value)} placeholder="9800" className={inputCls} min={0} />
              </Field>
            </div>
            {discount > 0 && (
              <div className="mt-2 p-2.5 bg-emerald-50 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
                <span>✅</span>
                <span>Discount: <strong>{discount}%</strong> — Customer saves Rs. {(form.price - form.salePrice).toLocaleString()}</span>
              </div>
            )}
          </Section>

          <Section title="Product Images">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-purple-300 transition-colors cursor-pointer">
              <div className="text-3xl mb-2">📁</div>
              <p className="text-sm font-medium text-gray-600 mb-1">Drop images here or click to upload</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB each. First image is the main product image.</p>
              <button className="mt-3 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors">
                Choose Files
              </button>
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Section title="Product Status">
            <Field label="Status">
              <select value={form.status} onChange={e => update('status', e.target.value)} className={`${inputCls} bg-white`}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </Field>
            <div className="mt-3 space-y-2">
              {[
                { field: 'featured', label: 'Featured Product' },
                { field: 'isNew', label: 'Mark as New Arrival' },
              ].map(opt => (
                <label key={opt.field} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[opt.field as keyof typeof form] as boolean}
                    onChange={e => update(opt.field, e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Inventory">
            <Field label="Stock Quantity">
              <input type="number" value={form.stock || ''} onChange={e => update('stock', +e.target.value)} placeholder="0" className={inputCls} min={0} />
            </Field>
            {form.stock === 0 && (
              <p className="text-xs text-amber-600 mt-1.5">⚠️ Zero stock will mark product as unavailable</p>
            )}
          </Section>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
            <button onClick={() => handleSave()} disabled={saving} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : null}
              {isEdit ? '💾 Save Changes' : '🚀 Publish Product'}
            </button>
            {!isEdit && (
              <button onClick={() => handleSave('draft')} disabled={saving} className="w-full py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Save as Draft
              </button>
            )}
            <button onClick={() => navigate(-1)} className="w-full py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
