import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSlider from '@/components/customer/HeroSlider';
import ProductCard from '@/components/customer/ProductCard';
import ProductCarousel from '@/components/customer/ProductCarousel';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';

function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 47, s: 32 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5">
      {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
        <>
          <div key={i} className="bg-white text-red-600 font-bold text-lg font-heading w-10 h-10 rounded-lg flex items-center justify-center shadow-sm tabular-nums">
            {unit}
          </div>
          {i < 2 && <span className="text-red-400 font-bold text-lg">:</span>}
        </>
      ))}
    </div>
  );
}

function DiscountPopup({ onDismiss }: { onDismiss: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full animate-scale-in">
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-center relative">
          <button onClick={onDismiss} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-5xl mb-3 animate-float">🎁</div>
          <div className="text-orange-300 text-sm font-semibold uppercase tracking-widest mb-2">Special Offer</div>
          <h2 className="text-white text-2xl font-bold font-heading mb-1">Get 10% OFF</h2>
          <p className="text-blue-200 text-sm">Your First Order!</p>
        </div>
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-semibold text-gray-800">Code sent to your email!</p>
              <p className="text-sm text-gray-500 mt-1">Use <span className="font-mono font-bold text-blue-700">WELCOME10</span> at checkout</p>
              <button onClick={onDismiss} className="mt-4 px-6 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors">Start Shopping</button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm text-center mb-4">Enter your email to get your exclusive discount code.</p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <button
                onClick={() => { if (email) setSubmitted(true); }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                Get My 10% Discount →
              </button>
              <button onClick={onDismiss} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1">
                No thanks, I prefer to pay full price
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { state } = useApp();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const featuredProducts = state.products.filter(p => p.featured).slice(0, 8);
  const flashSaleProducts = state.products.filter(p => p.discount >= 20).slice(0, 6);
  const newArrivals = state.products.filter(p => p.isNew).slice(0, 4);

  useEffect(() => {
    if (!state.discountPopupDismissed) {
      const timer = setTimeout(() => setShowPopup(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.discountPopupDismissed]);

  const { dispatch } = useApp();
  const handleDismissPopup = () => {
    setShowPopup(false);
    dispatch({ type: 'DISMISS_POPUP' });
  };

  return (
    <div className="min-h-screen">
      {showPopup && <DiscountPopup onDismiss={handleDismissPopup} />}

      {/* Hero */}
      <HeroSlider />

      {/* Trust badges */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: '🚚', title: 'Free Delivery', sub: 'On orders over Rs. 5,000' },
              { icon: '🔒', title: 'Secure Payment', sub: 'Multiple payment options' },
              { icon: '↩️', title: 'Easy Returns', sub: '7-day hassle-free returns' },
              { icon: '🏆', title: 'Premium Quality', sub: 'Genuine products only' },
            ].map(b => (
              <div key={b.title} className="flex items-center gap-3 px-4 sm:px-6 py-4">
                <span className="text-2xl">{b.icon}</span>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.sub}</p>
                </div>
                <p className="sm:hidden text-xs font-semibold text-gray-800">{b.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">Browse</p>
          <h2 className="text-3xl font-bold text-gray-900 font-heading">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Find exactly what you need across our curated product categories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative h-60 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent`} />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-white/70 text-xs font-medium">{cat.products} Products</span>
                </div>
                <h3 className="text-white font-bold text-lg font-heading leading-tight mb-1">{cat.name}</h3>
                <p className="text-white/60 text-xs line-clamp-2 mb-3">{cat.description}</p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${cat.color} text-white text-xs font-semibold w-fit group-hover:shadow-lg transition-shadow`}>
                  Explore Products
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">Handpicked</p>
              <h2 className="text-3xl font-bold text-gray-900 font-heading">Featured Products</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <ProductCarousel>
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductCarousel>
          <div className="text-center mt-8">
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-colors shadow-md">
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <div className="text-red-200 text-xs font-semibold uppercase tracking-widest">Limited Time</div>
                <h2 className="text-white text-2xl font-bold font-heading">Flash Sale</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm">Ends in:</span>
              <CountdownTimer />
            </div>
          </div>
        </div>

        <ProductCarousel itemClassName="w-[150px] sm:w-[170px] lg:w-[190px]">
          {flashSaleProducts.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block">
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse-badge">
                  FLASH -{product.discount}%
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">{product.name}</p>
                <div className="mt-1.5">
                  <span className="text-blue-700 font-bold text-sm">Rs. {product.salePrice.toLocaleString()}</span>
                  <span className="text-gray-400 text-[11px] line-through ml-1">Rs. {product.price.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </ProductCarousel>

        <div className="text-center mt-6">
          <Link to="/shop?sort=discount" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-red-500 text-red-600 font-semibold hover:bg-red-50 transition-colors">
            View All Deals
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Promotional banners */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Medical Supplies', sub: 'Up to 30% off certified equipment', badge: 'HEALTH WEEK', from: 'from-teal-600', to: 'to-cyan-700', icon: '⚕️', link: '/category/surgical' },
              { title: 'New Tool Arrivals', sub: 'Professional grade power tools now in stock', badge: 'JUST ARRIVED', from: 'from-amber-500', to: 'to-orange-600', icon: '🔧', link: '/category/hardware' },
              { title: 'Household Deals', sub: 'Stock up and save on everyday essentials', badge: 'BUNDLE & SAVE', from: 'from-emerald-600', to: 'to-green-700', icon: '🏠', link: '/category/household' },
            ].map(banner => (
              <Link key={banner.title} to={banner.link} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.from} ${banner.to} p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group`}>
                <div className="relative z-10">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md">{banner.badge}</span>
                  <h3 className="text-white font-bold text-lg font-heading mt-3 mb-1">{banner.title}</h3>
                  <p className="text-white/70 text-xs mb-4">{banner.sub}</p>
                  <span className="text-white text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Now
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
                <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">{banner.icon}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-1">Fresh Stock</p>
            <h2 className="text-3xl font-bold text-gray-900 font-heading">New Arrivals</h2>
          </div>
          <Link to="/shop?filter=new" className="text-sm font-semibold text-blue-700 hover:text-blue-900 hidden sm:block">
            See All New →
          </Link>
        </div>
        <ProductCarousel>
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductCarousel>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Why ProXmart</p>
          <h2 className="text-3xl font-bold font-heading mb-4">Pakistan's Most Trusted Store</h2>
          <p className="text-blue-200 max-w-xl mx-auto mb-12 text-sm">From premium sanitary fittings to medical supplies — every product is genuine, quality-tested, and backed by our satisfaction guarantee.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: '✅', value: '100%', label: 'Genuine Products' },
              { icon: '🚀', value: '24hr', label: 'Fast Dispatch' },
              { icon: '🌟', value: '50K+', label: 'Happy Customers' },
              { icon: '🏪', value: '4', label: 'Product Categories' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-blue-900/50 hover:bg-blue-900/80 transition-colors">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-2xl font-bold font-heading">{s.value}</span>
                <span className="text-blue-300 text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}