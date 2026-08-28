import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function CartPage() {
  const { cartItems, cartTotal, state, dispatch, showNotification } = useApp();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const delivery = cartTotal >= 5000 ? 0 : 500;
  const discount = state.couponDiscount;
  const total = cartTotal - discount + delivery;

  const applyCoupon = () => {
    const code = state.discountCodes.find(
      d => d.code === couponInput.toUpperCase() && d.status === 'active'
    );
    if (code) {
      const discountAmt = code.type === 'percentage' ? Math.round(cartTotal * code.value / 100) : code.value;
      dispatch({ type: 'APPLY_COUPON', payload: { code: code.code, discount: discountAmt } });
      showNotification(`Coupon applied! You saved Rs. ${discountAmt.toLocaleString()}`);
    } else {
      showNotification('Invalid or expired coupon code', 'error');
    }
    setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products yet.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-colors">
            Start Shopping
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">
          Shopping Cart <span className="text-gray-400 font-normal text-base">({cartItems.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 animate-fade-in">
                <div className="flex gap-4">
                  <Link to={`/product/${product.id}`} className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-blue-600 font-medium">{product.brand}</p>
                        <Link to={`/product/${product.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-700 line-clamp-2">{product.name}</Link>
                        {product.status === 'low-stock' && (
                          <p className="text-xs text-amber-600 mt-0.5">Only {product.stock} left!</p>
                        )}
                      </div>
                      <button
                        onClick={() => { dispatch({ type: 'REMOVE_FROM_CART', payload: product.id }); showNotification('Item removed from cart', 'info'); }}
                        className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { productId: product.id, quantity: quantity - 1 } })} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg">−</button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                        <button onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { productId: product.id, quantity: quantity + 1 } })} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg">+</button>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-900">Rs. {(product.salePrice * quantity).toLocaleString()}</p>
                        {quantity > 1 && <p className="text-xs text-gray-400">Rs. {product.salePrice.toLocaleString()} each</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mt-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Coupon Code</h3>
              {state.appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <div>
                    <span className="text-xs text-emerald-600 font-mono font-bold">{state.appliedCoupon}</span>
                    <p className="text-xs text-emerald-700">−Rs. {state.couponDiscount.toLocaleString()} saved!</p>
                  </div>
                  <button onClick={() => dispatch({ type: 'REMOVE_COUPON' })} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  />
                  <button onClick={applyCoupon} className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">Apply</button>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Try: WELCOME10</p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>Rs. {cartTotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span>−Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-emerald-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : `Rs. ${delivery.toLocaleString()}`}</span>
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-gray-400">Add Rs. {(5000 - cartTotal).toLocaleString()} more for free delivery</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-5 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure checkout — all data is encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
