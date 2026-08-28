import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function ContactPage() {
  const { showNotification } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showNotification('Message sent! We\'ll reply within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-950 to-blue-900 text-white py-14 text-center">
        <h1 className="text-4xl font-bold font-heading mb-3">Contact Us</h1>
        <p className="text-blue-200 text-base max-w-xl mx-auto">Have a question? We're here to help 24/7. Reach out through any channel below.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: '📞', title: 'Phone', lines: ['+92-300-000-0000', '+92-321-000-0000'], sub: 'Mon–Sat, 9am–8pm' },
              { icon: '📧', title: 'Email', lines: ['support@proxmart.com', 'orders@proxmart.com'], sub: 'Response within 24 hrs' },
              { icon: '📍', title: 'Address', lines: ['45-B Model Town', 'Lahore, Punjab 54000'], sub: 'Pakistan' },
              { icon: '⏰', title: 'Business Hours', lines: ['Monday – Saturday', '9:00 AM – 8:00 PM'], sub: 'Sunday: 10am – 5pm' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 hover:shadow-md transition-shadow">
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                  {item.lines.map(l => <p key={l} className="text-gray-700 text-sm">{l}</p>)}
                  <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3 animate-float">✅</div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading mb-1">Message Sent!</h2>
                  <p className="text-gray-500 text-sm">Our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-5 px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-gray-900 font-heading mb-5">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                        <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ahmed Hassan" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="ahmed@email.com" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                      <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Select a topic</option>
                        <option>Order Support</option>
                        <option>Product Inquiry</option>
                        <option>Shipping & Delivery</option>
                        <option>Return & Refund</option>
                        <option>Bulk/Business Orders</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                      <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us how we can help you..." className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors shadow-md">
                      Send Message →
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { q: 'What is your delivery time?', a: 'Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business days.' },
              { q: 'Do you offer returns?', a: 'Yes, we offer a 7-day hassle-free return policy on most products.' },
              { q: 'Are all products genuine?', a: 'Absolutely. All products are sourced directly from authorized distributors and are 100% genuine.' },
              { q: 'Do you offer bulk orders?', a: 'Yes! Contact us for special pricing on bulk and business orders.' },
            ].map(faq => (
              <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">❓ {faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
