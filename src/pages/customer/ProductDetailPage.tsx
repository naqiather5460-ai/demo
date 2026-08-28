import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/customer/ProductCard';
import { useApp } from '@/context/AppContext';

const reviews = [
  { name: 'Ahmed K.', rating: 5, date: '2024-07-12', text: 'Excellent quality! Exactly as described. Fast delivery and great packaging.', verified: true },
  { name: 'Sara M.', rating: 4, date: '2024-06-28', text: 'Very good product, happy with the purchase. Would recommend.', verified: true },
  { name: 'Omar F.', rating: 5, date: '2024-06-15', text: 'Premium quality, worth every penny. Customer service was also very helpful.', verified: false },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProduct, dispatch, isInWishlist, state, showNotification } = useApp();
  const navigate = useNavigate();
  const product = getProduct(id || '');

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
          <Link to="/shop" className="mt-4 inline-block text-blue-600 hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const isBuyable = product.status === 'in-stock' || product.status === 'low-stock';
  const relatedProducts = state.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const addToCart = () => {
    if (!isBuyable) return;
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, quantity } });
    showNotification(`${quantity}× ${product.name} added to cart!`);
  };

  const buyNow = () => {
    if (!isBuyable) return;
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, quantity } });
    navigate('/cart');
  };

  const statusBadge: Record<string, { label: string; color: string; dot: string }> = {
    'in-stock': { label: 'In Stock', color: 'text-emerald-600 bg-emerald-50', dot: 'bg-emerald-500' },
    'low-stock': { label: `Low Stock (${product.stock} left)`, color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-500' },
    'out-of-stock': { label: 'Out of Stock', color: 'text-red-600 bg-red-50', dot: 'bg-red-500' },
    'sold-out': { label: 'Sold Out', color: 'text-gray-600 bg-gray-100', dot: 'bg-gray-400' },
  };
  const status = statusBadge[product.status] || statusBadge['in-stock'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-blue-600">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-blue-600">Shop</Link><span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-blue-600 capitalize">{product.category}</Link><span>/</span>
          <span className="text-gray-700 line-clamp-1">{product.name}</span>
        </nav>

        {/* Main product section */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 group">
                <img
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    -{product.discount}% OFF
                  </div>
                )}
                {!isBuyable && (
                  <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                    <span className="bg-gray-800 text-white font-bold text-lg px-6 py-3 rounded-xl uppercase">
                      {product.status === 'sold-out' ? 'Sold Out' : 'Out of Stock'}
                    </span>
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-blue-600' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.brand}</span>
                <span className="text-xs text-gray-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading leading-snug mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-5 p-4 bg-gray-50 rounded-2xl">
                <span className="text-3xl font-bold text-gray-900 font-heading">Rs. {product.salePrice.toLocaleString()}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through mb-1">Rs. {product.price.toLocaleString()}</span>
                    <span className="text-emerald-600 font-semibold text-sm mb-1">
                      You save Rs. {(product.price - product.salePrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Quantity */}
              {isBuyable && (
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900 tabular-nums">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={addToCart}
                  disabled={!isBuyable}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    isBuyable ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-md hover:shadow-lg active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {isBuyable ? 'Add to Cart' : 'Currently Unavailable'}
                </button>
                {isBuyable && (
                  <button
                    onClick={buyNow}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                  >
                    Buy Now
                  </button>
                )}
                <button
                  onClick={() => { dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id }); showNotification(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!'); }}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors ${inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'}`}
                >
                  <svg className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Delivery info */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-2xl text-sm">
                {[
                  { icon: '🚚', text: 'Free delivery on orders over Rs. 5,000' },
                  { icon: '↩️', text: '7-day hassle-free returns & exchanges' },
                  { icon: '🔒', text: '100% genuine product guarantee' },
                  { icon: '📞', text: '24/7 customer support available' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2.5 text-gray-600">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(['description', 'specs', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td className="py-2.5 pr-6 font-medium text-gray-600 w-40 shrink-0">{key}</td>
                        <td className="py-2.5 text-gray-900">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shrink-0">
                      {r.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">{r.name}</span>
                          {r.verified && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>}
                        </div>
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-1.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <svg key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
