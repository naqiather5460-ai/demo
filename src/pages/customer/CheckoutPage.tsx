import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Order, PaymentMethod } from '@/data/mockData';

const steps = ['Delivery Info', 'Delivery Method', 'Payment', 'Review Order'];

type DeliveryInfo = {
  fullName: string; email: string; phone: string;
  street: string; city: string; postalCode: string;
};

const deliveryOptions = [
  { id: 'standard', name: 'Standard Delivery', time: '3-5 Business Days', price: 0, desc: 'Free on orders over Rs. 5,000' },
  { id: 'express', name: 'Express Delivery', time: '1-2 Business Days', price: 500, desc: 'Fast & reliable door-to-door' },
  { id: 'same-day', name: 'Same Day Delivery', time: 'Today by 8 PM', price: 1200, desc: 'Lahore only — order before 12 PM' },
];

const paymentOptions: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: 'cash-on-delivery', label: 'Cash on Delivery', icon: '💵', desc: 'Pay in cash when your order arrives' },
  { id: 'credit-card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, and more' },
  { id: 'bank-transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank transfer — IBFT' },
  { id: 'digital-wallet', label: 'Digital Wallet', icon: '📱', desc: 'EasyPaisa, JazzCash, and more' },
];

export default function CheckoutPage() {
  const { cartItems, cartTotal, state, dispatch } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [info, setInfo] = useState<DeliveryInfo>({ fullName: '', email: '', phone: '', street: '', city: '', postalCode: '' });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash-on-delivery');
  const [errors, setErrors] = useState<Partial<DeliveryInfo>>({});
  const [placing, setPlacing] = useState(false);

  const selectedDelivery = deliveryOptions.find(d => d.id === deliveryMethod)!;
  const delivery = cartTotal >= 5000 ? 0 : selectedDelivery.price;
  const discount = state.couponDiscount;
  const total = cartTotal - discount + delivery;

  const validate = () => {
    const errs: Partial<DeliveryInfo> = {};
    if (!info.fullName) errs.fullName = 'Required';
    if (!info.email || !/\S+@\S+\.\S+/.test(info.email)) errs.email = 'Valid email required';
    if (!info.phone) errs.phone = 'Required';
    if (!info.street) errs.street = 'Required';
    if (!info.city) errs.city = 'Required';
    if (!info.postalCode) errs.postalCode = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step === 0 && !validate()) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const placeOrder = () => {
    setPlacing(true);
    const order: Order = {
      id: `ORD-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      customerId: 'cus-current',
      customerName: info.fullName,
      customerEmail: info.email,
      items: cartItems.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.salePrice,
        quantity,
      })),
      subtotal: cartTotal,
      discount,
      delivery,
      total,
      status: 'pending',
      paymentMethod,
      address: { fullName: info.fullName, phone: info.phone, street: info.street, city: info.city, postalCode: info.postalCode },
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      trackingNumber: `TRK-${Date.now()}`,
    };
    dispatch({ type: 'PLACE_ORDER', payload: order });
    setTimeout(() => navigate(`/order-confirmation/${order.id}`), 800);
  };

  const Field = ({ label, field, type = 'text', placeholder }: { label: string; field: keyof DeliveryInfo; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={info[field]}
        onChange={e => setInfo(prev => ({ ...prev, [field]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
      />
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 font-heading mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium whitespace-nowrap ${i === step ? 'text-blue-700' : i < step ? 'text-emerald-600' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {/* Step 1: Delivery info */}
              {step === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="font-semibold text-gray-900 mb-4">Delivery Information</h2>
                  <Field label="Full Name" field="fullName" placeholder="Ahmed Hassan" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Email Address" field="email" type="email" placeholder="ahmed@email.com" />
                    <Field label="Phone Number" field="phone" placeholder="+92 300 0000000" />
                  </div>
                  <Field label="Complete Address" field="street" placeholder="House #, Street, Area" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City" field="city" placeholder="Lahore" />
                    <Field label="Postal Code" field="postalCode" placeholder="54000" />
                  </div>
                </div>
              )}

              {/* Step 2: Delivery method */}
              {step === 1 && (
                <div className="space-y-3 animate-fade-in">
                  <h2 className="font-semibold text-gray-900 mb-4">Delivery Method</h2>
                  {deliveryOptions.map(opt => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === opt.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="delivery" checked={deliveryMethod === opt.id} onChange={() => setDeliveryMethod(opt.id)} className="accent-blue-700" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm">{opt.name}</span>
                          <span className="font-bold text-gray-900 text-sm">{opt.price === 0 ? 'Free' : `Rs. ${opt.price}`}</span>
                        </div>
                        <p className="text-xs text-blue-600 mt-0.5">{opt.time}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
                  {paymentOptions.map(opt => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === opt.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="accent-blue-700" />
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center gap-2 text-xs text-blue-700">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    All transactions are encrypted and secure
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <h2 className="font-semibold text-gray-900 mb-4">Order Review</h2>
                  <div className="space-y-3 mb-5">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-900">Rs. {(product.salePrice * quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                      <p className="font-medium text-gray-800">{info.fullName}</p>
                      <p className="text-gray-600 text-xs">{info.street}, {info.city} {info.postalCode}</p>
                      <p className="text-gray-600 text-xs">{info.phone}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Payment & Delivery</p>
                      <p className="font-medium text-gray-800">{paymentOptions.find(p => p.id === paymentMethod)?.label}</p>
                      <p className="text-gray-600 text-xs">{selectedDelivery.name}</p>
                      <p className="text-xs text-blue-600">{selectedDelivery.time}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                {step > 0 ? (
                  <button onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">← Back</button>
                ) : <div />}
                {step < 3 ? (
                  <button onClick={next} className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors">
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-60"
                  >
                    {placing ? 'Placing Order...' : 'Place Order 🎉'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={product.image} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      <span className="text-gray-600 truncate">{product.name} ×{quantity}</span>
                    </div>
                    <span className="font-medium text-gray-900 shrink-0">Rs. {(product.salePrice * quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2.5 space-y-1.5">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
                  {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−Rs. {discount.toLocaleString()}</span></div>}
                  <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{delivery === 0 ? 'Free' : `Rs. ${delivery}`}</span></div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-1.5 border-t border-gray-100"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
