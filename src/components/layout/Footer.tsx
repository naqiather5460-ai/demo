import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-16 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/brand/logo.jpeg" alt="Dukandar" className="w-10 h-10 rounded-xl object-cover" />
              <span className="text-white font-bold text-xl font-heading">Dukandar</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Your trusted destination for premium sanitary, hardware, medical, and household products. Quality you can count on.
            </p>
            <div className="flex gap-3">
              {['M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
                'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
                'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z'
              ].map((d, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/shop' },
                { label: 'Flash Deals', to: '/shop?sort=discount' },
                { label: 'New Arrivals', to: '/shop?filter=new' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-blue-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: '🚿 Sanitary Items', to: '/category/sanitary' },
                { label: '🔧 Hardware & Tools', to: '/category/hardware' },
                { label: '⚕️ Surgical & Medical', to: '/category/surgical' },
                { label: '🏠 Household Essentials', to: '/category/household' },
              ].map(cat => (
                <li key={cat.to}>
                  <Link to={cat.to} className="hover:text-blue-400 transition-colors">{cat.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3 text-sm">
              {[
                { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+92-300-000-0000' },
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'support@proxmart.com' },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'Lahore, Punjab, Pakistan' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-400">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-5">
              <p className="text-xs text-gray-400 mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-0"
                />
                <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-slate-800 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
            {[
              { icon: '🚚', title: 'Free Delivery', sub: 'Orders over Rs. 5,000' },
              { icon: '🔒', title: 'Secure Payment', sub: '100% secure checkout' },
              { icon: '↩️', title: 'Easy Returns', sub: '7-day return policy' },
              { icon: '🎧', title: '24/7 Support', sub: 'Always here to help' },
            ].map(badge => (
              <div key={badge.title} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-white text-xs font-semibold">{badge.title}</span>
                <span className="text-gray-500 text-[11px]">{badge.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© 2026 Dukandar. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
