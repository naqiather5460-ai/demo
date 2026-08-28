import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { heroSlides } from '@/data/mockData';

export default function AdminHomepageContent() {
  const { state, showNotification } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);
  const [popupEnabled, setPopupEnabled] = useState(!state.discountPopupDismissed);
  const [popupForm, setPopupForm] = useState({ title: 'Get 10% OFF Your First Order!', code: 'WELCOME10', delay: 3 });
  const [slides, setSlides] = useState(heroSlides.map(s => ({ ...s })));

  const handleSaveSlide = (i: number) => {
    showNotification(`Hero slide ${i + 1} saved!`);
  };

  const handleSavePopup = () => {
    showNotification('Discount popup settings saved!');
  };

  const featuredProducts = state.products.filter(p => p.featured);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-heading">Homepage Content</h1>
        <p className="text-gray-500 text-sm">Manage what customers see on the homepage — no coding required</p>
      </div>

      {/* Hero Slider Management */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">🖼️</span> Hero Slider Banners
        </h2>

        {/* Slide tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeSlide === i ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Slide {i + 1}: {slide.category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Preview */}
          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <img src={slides[activeSlide].image} alt="" className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[activeSlide].gradient} opacity-80`} />
            <div className="absolute inset-0 flex flex-col justify-center p-6">
              <p className="text-white font-bold text-sm font-heading leading-snug">{slides[activeSlide].headline}</p>
              <p className="text-white/70 text-xs mt-1">{slides[activeSlide].subheadline}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 rounded-lg text-[10px] font-semibold text-white" style={{ backgroundColor: slides[activeSlide].accent }}>{slides[activeSlide].cta1}</span>
                <span className="px-3 py-1 rounded-lg text-[10px] font-semibold text-white border border-white/30">{slides[activeSlide].cta2}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-md">Preview</div>
          </div>

          {/* Edit form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Headline</label>
              <input
                value={slides[activeSlide].headline}
                onChange={e => setSlides(prev => prev.map((s, i) => i === activeSlide ? { ...s, headline: e.target.value } : s))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subheadline</label>
              <input
                value={slides[activeSlide].subheadline}
                onChange={e => setSlides(prev => prev.map((s, i) => i === activeSlide ? { ...s, subheadline: e.target.value } : s))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Button 1 Text</label>
                <input value={slides[activeSlide].cta1} onChange={e => setSlides(prev => prev.map((s, i) => i === activeSlide ? { ...s, cta1: e.target.value } : s))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Button 2 Text</label>
                <input value={slides[activeSlide].cta2} onChange={e => setSlides(prev => prev.map((s, i) => i === activeSlide ? { ...s, cta2: e.target.value } : s))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Badge Label</label>
              <input value={slides[activeSlide].badge} onChange={e => setSlides(prev => prev.map((s, i) => i === activeSlide ? { ...s, badge: e.target.value } : s))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" />
            </div>
            <button onClick={() => handleSaveSlide(activeSlide)} className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors">
              💾 Save Slide Changes
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">⭐</span> Featured Products ({featuredProducts.length} selected)
        </h2>
        <p className="text-sm text-gray-500 mb-4">Toggle which products appear in the "Featured Products" section on the homepage.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {state.products.map(product => {
            const isFeatured = product.featured;
            return (
              <div
                key={product.id}
                className={`relative p-2.5 rounded-xl border-2 cursor-pointer transition-all ${isFeatured ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => showNotification(`${product.name} ${isFeatured ? 'removed from' : 'added to'} featured products`)}
              >
                <img src={product.image} alt="" className="w-full aspect-square object-cover rounded-lg mb-2" />
                <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">{product.name}</p>
                {isFeatured && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Discount Popup */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-xl">🎁</span> Discount Popup
          </h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">Enable</span>
            <div
              onClick={() => setPopupEnabled(!popupEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${popupEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${popupEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Popup Title</label>
            <input value={popupForm.title} onChange={e => setPopupForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Coupon Code</label>
            <input value={popupForm.code} onChange={e => setPopupForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Show After (seconds)</label>
            <input type="number" value={popupForm.delay} onChange={e => setPopupForm(p => ({ ...p, delay: +e.target.value }))} min={0} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>
        <button onClick={handleSavePopup} className="mt-3 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors">
          Save Popup Settings
        </button>
      </div>
    </div>
  );
}
