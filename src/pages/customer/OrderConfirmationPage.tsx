import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const [show, setShow] = useState(false);

  const order = state.orders.find(o => o.id === id);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found.</p>
          <Link to="/" className="mt-3 inline-block text-blue-600 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const paymentLabels: Record<string, string> = {
    'cash-on-delivery': 'Cash on Delivery',
    'credit-card': 'Credit / Debit Card',
    'bank-transfer': 'Bank Transfer',
    'digital-wallet': 'Digital Wallet',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success card */}
        <div className={`bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-white text-2xl font-bold font-heading mb-1">Order Placed Successfully!</h1>
            <p className="text-emerald-100 text-sm">Thank you for shopping with ProXmart</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Order info */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Order ID</p>
                  <p className="font-bold text-gray-900 font-mono">{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Tracking</p>
                  <p className="font-bold text-blue-700 font-mono">{order.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Estimated Delivery</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Payment</p>
                  <p className="font-semibold text-gray-900">{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Items</h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border border-gray-100 rounded-xl p-4 text-sm space-y-1.5">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−Rs. {order.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.delivery === 0 ? 'Free' : `Rs. ${order.delivery}`}</span></div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-1.5 border-t border-gray-100"><span>Total Paid</span><span>Rs. {order.total.toLocaleString()}</span></div>
            </div>

            {/* Delivery address */}
            <div className="bg-blue-50 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-1">Delivering to:</p>
              <p className="text-blue-800">{order.address.fullName}</p>
              <p className="text-blue-700 text-xs">{order.address.street}, {order.address.city} {order.address.postalCode}</p>
              <p className="text-blue-700 text-xs">{order.address.phone}</p>
            </div>

            {/* Tracking timeline */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Status</h3>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200" />
                <div className="absolute top-4 left-4 h-0.5 bg-blue-500 transition-all" style={{ width: '10%' }} />
                {['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((s, i) => (
                  <div key={s} className="flex flex-col items-center gap-1.5 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-400'}`}>
                      {i === 0 ? '✓' : i + 1}
                    </div>
                    <span className={`text-[9px] font-medium text-center ${i === 0 ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link to={`/track/${order.id}`} className="flex-1 py-3 border-2 border-blue-700 text-blue-700 font-semibold rounded-xl text-center text-sm hover:bg-blue-50 transition-colors">
                Track Order
              </Link>
              <Link to="/shop" className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-center text-sm transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
