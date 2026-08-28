import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/data/mockData';

interface Props {
  product: Product;
  view?: 'grid' | 'list';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const statusConfig = {
  'in-stock': { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700' },
  'low-stock': { label: 'Low Stock', color: 'bg-amber-100 text-amber-700' },
  'out-of-stock': { label: 'Out of Stock', color: 'bg-red-100 text-red-700' },
  'sold-out': { label: 'Sold Out', color: 'bg-gray-100 text-gray-600' },
  'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-500' },
  'published': { label: 'Published', color: 'bg-blue-100 text-blue-700' },
};

export default function ProductCard({ product, view = 'grid' }: Props) {
  const { dispatch, isInWishlist, showNotification } = useApp();
  const inWishlist = isInWishlist(product.id);
  const isBuyable = product.status === 'in-stock' || product.status === 'low-stock';
  const status = statusConfig[product.status] || statusConfig['in-stock'];

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isBuyable) return;
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id } });
    showNotification(`${product.name} added to cart!`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    showNotification(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  if (view === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="group flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-100 transition-all duration-300 animate-fade-in">
        <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {product.discount > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">-{product.discount}%</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-blue-600 font-medium capitalize">{product.brand}</p>
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">{product.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating rating={product.rating} />
                <span className="text-xs text-gray-400">({product.reviews})</span>
              </div>
            </div>
            <button onClick={toggleWishlist} className={`shrink-0 p-1.5 rounded-lg transition-colors ${inWishlist ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'}`}>
              <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-base font-bold text-gray-900">Rs. {product.salePrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <span className="text-xs text-gray-400 line-through ml-1.5">Rs. {product.price.toLocaleString()}</span>
              )}
            </div>
            <button
              onClick={addToCart}
              disabled={!isBuyable}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isBuyable ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {isBuyable ? 'Add to Cart' : 'Unavailable'}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="group product-card bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-100 animate-fade-in block">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.discount > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse-badge">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">BESTSELLER</span>
          )}
        </div>

        {/* Sold out overlay */}
        {(product.status === 'sold-out' || product.status === 'out-of-stock') && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white font-bold text-sm px-4 py-2 rounded-xl tracking-wider uppercase">
              {product.status === 'sold-out' ? 'Sold Out' : 'Out of Stock'}
            </span>
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={toggleWishlist}
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-colors ${inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-500 hover:bg-red-500 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-md text-gray-500 hover:bg-blue-700 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-blue-600 font-medium capitalize">{product.brand}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${status.color}`}>{status.label}</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-end justify-between mt-2.5">
          <div>
            <div className="text-base font-bold text-gray-900">Rs. {product.salePrice.toLocaleString()}</div>
            {product.discount > 0 && (
              <div className="text-xs text-gray-400 line-through">Rs. {product.price.toLocaleString()}</div>
            )}
          </div>

          <button
            onClick={addToCart}
            disabled={!isBuyable}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isBuyable
                ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm hover:shadow-md active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isBuyable ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Cart
              </>
            ) : 'Unavailable'}
          </button>
        </div>
      </div>
    </Link>
  );
}
