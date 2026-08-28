import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const trackingSteps = [
  { key: 'pending', label: 'Order Placed', icon: '📋', desc: 'We received your order' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Order confirmed & payment verified' },
  { key: 'processing', label: 'Processing', icon: '⚙️', desc: 'Your order is being prepared' },
  { key: 'shipped', label: 'Shipped', icon: '📦', desc: 'Order dispatched to courier' },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: '🚚', desc: 'With delivery agent near you' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Order successfully delivered' },
];

const orderStatusIndex: Record<string, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, 'out-for-delivery': 4, delivered: 5
};

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const order = state.orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-10 shadow-md">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-lg font-bold text-gray-800">Order Not Found</h2>
          <Link to="/" className="mt-3 inline-block text-blue-600 hover:underline text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  const currentStep = order.status === 'cancelled' ? -1 : orderStatusIndex[order.status] ?? 0;
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/orders" className="text-gray-400 hover:text-gray-600 text-sm">My Orders</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-mono text-sm">{order.id}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">Order Tracking</h1>

        {/* Order info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="font-bold text-gray-900 font-mono text-xs">{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tracking #</p>
              <p className="font-bold text-blue-700 font-mono text-xs">{order.trackingNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Order Date</p>
              <p className="font-semibold text-gray-900">{new Date(order.placedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Est. Delivery</p>
              <p className="font-semibold text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</p>
            </div>
          </div>
        </div>

        {/* Tracking timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
          <h2 className="font-semibold text-gray-900 mb-6">Shipment Status</h2>

          {isCancelled ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">❌</div>
              <p className="font-bold text-red-600">Order Cancelled</p>
              <p className="text-gray-500 text-sm mt-1">This order has been cancelled. Refund will be processed within 3-5 business days.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {trackingSteps.map((step, i) => {
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;
                const isPending = i > currentStep;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${isCompleted ? 'bg-emerald-500 border-emerald-500' : isCurrent ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-100' : 'bg-white border-gray-200'}`}>
                        {isCompleted ? '✓' : <span className={`${isPending ? 'grayscale opacity-50' : ''}`}>{step.icon}</span>}
                      </div>
                      {i < trackingSteps.length - 1 && (
                        <div className={`w-0.5 flex-1 my-1 ${isCompleted ? 'bg-emerald-400' : 'bg-gray-200'}`} style={{ minHeight: '2.5rem' }} />
                      )}
                    </div>
                    <div className={`pb-6 ${i === trackingSteps.length - 1 ? 'pb-0' : ''}`}>
                      <p className={`font-semibold text-sm ${isCompleted ? 'text-emerald-600' : isCurrent ? 'text-blue-700' : 'text-gray-400'}`}>{step.label}</p>
                      <p className={`text-xs mt-0.5 ${isPending ? 'text-gray-300' : 'text-gray-500'}`}>{step.desc}</p>
                      {isCurrent && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-[11px] text-blue-600 font-medium">Current Status</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
          <div className="flex items-start gap-3 text-sm">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{order.address.fullName}</p>
              <p className="text-gray-600">{order.address.street}</p>
              <p className="text-gray-600">{order.address.city}, {order.address.postalCode}</p>
              <p className="text-gray-500">{order.address.phone}</p>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.productId} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-gray-900 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
