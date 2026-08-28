import { Link } from 'react-router-dom';
import ProductCard from '@/components/customer/ProductCard';
import { useApp } from '@/context/AppContext';

export default function WishlistPage() {
  const { state, dispatch, showNotification } = useApp();
  const wishlistProducts = state.products.filter(p => state.wishlist.includes(p.id));

  const moveAllToCart = () => {
    wishlistProducts.filter(p => p.status === 'in-stock' || p.status === 'low-stock').forEach(p => {
      dispatch({ type: 'ADD_TO_CART', payload: { productId: p.id } });
    });
    showNotification('Available items added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">My Wishlist</h1>
            <p className="text-gray-500 text-sm mt-0.5">{wishlistProducts.length} saved items</p>
          </div>
          {wishlistProducts.length > 0 && (
            <div className="flex gap-2">
              <button onClick={moveAllToCart} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors">
                Add All to Cart
              </button>
              <button onClick={() => { state.wishlist.forEach(id => dispatch({ type: 'TOGGLE_WISHLIST', payload: id })); }} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-colors">
                Clear All
              </button>
            </div>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-bold text-gray-800 font-heading mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-500 text-sm mb-6">Save products you love by clicking the heart icon.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-colors">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
