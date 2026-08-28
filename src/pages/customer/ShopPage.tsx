import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/customer/ProductCard';
import { useApp } from '@/context/AppContext';
import type { Category } from '@/data/mockData';

const categoryLabels: Record<string, string> = {
  sanitary: 'Sanitary Items',
  hardware: 'Hardware & Tools',
  surgical: 'Surgical & Medical',
  household: 'Household Essentials',
};

export default function ShopPage({ filterCategory }: { filterCategory?: Category }) {
  const { state } = useApp();
  const [searchParams] = useSearchParams();
  const sortParam = searchParams.get('sort');
  const filterParam = searchParams.get('filter');

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory || '');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState(sortParam || 'popular');
  const [availability, setAvailability] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...state.products];

    if (filterCategory) list = list.filter(p => p.category === filterCategory);
    else if (selectedCategory) list = list.filter(p => p.category === selectedCategory);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (availability === 'available') list = list.filter(p => p.status === 'in-stock' || p.status === 'low-stock');
    if (availability === 'instock') list = list.filter(p => p.status === 'in-stock');

    list = list.filter(p => p.salePrice >= priceRange[0] && p.salePrice <= priceRange[1]);

    if (filterParam === 'new') list = list.filter(p => p.isNew);

    switch (sortParam || sortBy) {
      case 'discount': list.sort((a, b) => b.discount - a.discount); break;
      case 'price-low': list.sort((a, b) => a.salePrice - b.salePrice); break;
      case 'price-high': list.sort((a, b) => b.salePrice - a.salePrice); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'newest': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [state.products, filterCategory, selectedCategory, searchQuery, availability, priceRange, sortBy, sortParam, filterParam]);

  const title = filterCategory ? categoryLabels[filterCategory] : 'All Products';

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Search</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      {!filterCategory && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Category</h3>
          <div className="space-y-1.5">
            {[{ id: '', label: 'All Categories' }, ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label }))].map(cat => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                  className="w-4 h-4 accent-blue-700"
                />
                <span className={`text-sm transition-colors ${selectedCategory === cat.id ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Availability</h3>
        <div className="space-y-1.5">
          {[{ v: 'all', l: 'All Products' }, { v: 'available', l: 'Available Only' }, { v: 'instock', l: 'In Stock' }].map(opt => (
            <label key={opt.v} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="avail" checked={availability === opt.v} onChange={() => setAvailability(opt.v)} className="w-4 h-4 accent-blue-700" />
              <span className={`text-sm transition-colors ${availability === opt.v ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt.l}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Price Range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={50000}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], +e.target.value])}
            className="w-full accent-blue-700"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Rs. 0</span>
            <span className="text-blue-700 font-medium">Rs. {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => { setSelectedCategory(''); setPriceRange([0, 50000]); setAvailability('all'); setSearchQuery(''); }}
        className="w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <span>Home</span><span>/</span><span className="text-gray-700">{title}</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">{title}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{filtered.length} products found</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Filters</h2>
              <Sidebar />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5 bg-white rounded-2xl border border-gray-100 p-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                Filters
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-50'} transition-colors`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </button>
                  <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-blue-700 text-white' : 'text-gray-400 hover:bg-gray-50'} transition-colors`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile filter drawer */}
            {sidebarOpen && (
              <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                <Sidebar />
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold text-gray-800">No Products Found</h3>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query.</p>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(p => <ProductCard key={p.id} product={p} view="list" />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
