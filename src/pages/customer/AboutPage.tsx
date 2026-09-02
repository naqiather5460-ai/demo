import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-5">About Dukandar</h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-2xl mx-auto">
            Pakistan's trusted destination for premium sanitary, hardware, medical, and household products.
            Built on trust, quality, and service excellence since 2020.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-14">
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '10K+', label: 'Products' },
            { value: '4', label: 'Categories' },
            { value: '99%', label: 'Satisfaction Rate' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-900 font-heading">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-center">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Our Mission</p>
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">Delivering Quality You Can Trust</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dukandar was founded with a simple goal: make premium products accessible to every home and business in Pakistan. We believe quality shouldn't be a luxury — it should be the standard.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From professional-grade surgical instruments to everyday household essentials, every product on our platform is carefully sourced, quality-tested, and backed by our satisfaction guarantee.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-colors">
              Explore Our Products →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '✅', title: 'Genuine Products', desc: 'All items sourced directly from authorized distributors' },
              { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day dispatch for in-stock items' },
              { icon: '🛡️', title: 'Quality Assured', desc: 'Rigorous quality checks on every product' },
              { icon: '💬', title: 'Expert Support', desc: '24/7 customer support from real humans' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-100 transition-all">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-blue-950 rounded-3xl p-8 text-white mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-heading mb-2">What We Offer</h2>
            <p className="text-blue-300 text-sm">Four specialized product categories under one roof</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🚿', title: 'Sanitary & Bathroom', count: '200+' },
              { icon: '🔧', title: 'Hardware & Tools', count: '350+' },
              { icon: '⚕️', title: 'Surgical & Medical', count: '180+' },
              { icon: '🏠', title: 'Household Essentials', count: '400+' },
            ].map(cat => (
              <div key={cat.title} className="bg-white/10 rounded-2xl p-4 text-center hover:bg-white/20 transition-colors">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-sm">{cat.title}</div>
                <div className="text-blue-400 text-xs mt-1">{cat.count} Products</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-8">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Our Team</p>
            <h2 className="text-3xl font-bold text-gray-900 font-heading">The People Behind Dukandar</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {[
              { name: 'Muhammad Hassan', role: 'CEO & Founder', emoji: '👨‍💼' },
              { name: 'Ayesha Khan', role: 'Head of Operations', emoji: '👩‍💼' },
              { name: 'Omar Farooq', role: 'Product Manager', emoji: '👨‍💻' },
            ].map(member => (
              <div key={member.name} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl mx-auto mb-3">
                  {member.emoji}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
