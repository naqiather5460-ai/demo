import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const { dispatch, showNotification } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    if (!isLogin && form.password !== form.confirm) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'LOGIN', payload: { name: isLogin ? 'Ahmed Hassan' : form.name || 'Customer', email: form.email } });
      showNotification(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/account');
    }, 1000);
  };

  const loginAsAdmin = () => {
    dispatch({ type: 'LOGIN', payload: { name: 'Admin User', email: 'admin@proxmart.com' } });
    dispatch({ type: 'TOGGLE_ADMIN_MODE' });
    showNotification('Welcome, Admin!');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold font-heading">PX</span>
            </div>
            <span className="text-white font-bold text-xl font-heading">ProXmart</span>
          </Link>
          <p className="text-blue-300 text-sm mt-2">Premium E-Commerce Store</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-4 text-sm font-semibold transition-colors ${isLogin ? 'bg-blue-700 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Sign In</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-4 text-sm font-semibold transition-colors ${!isLogin ? 'bg-blue-700 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ahmed Hassan" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : isLogin ? 'Sign In →' : 'Create Account →'}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {['Google', 'Facebook'].map(p => (
                <button key={p} type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  {p === 'Google' ? '🔍' : '📘'} {p}
                </button>
              ))}
            </div>
          </form>

          {/* Admin shortcut */}
          <div className="border-t border-gray-100 p-4 bg-gray-50 text-center">
            <p className="text-xs text-gray-500 mb-2">Demo: Access Admin Dashboard</p>
            <button onClick={loginAsAdmin} className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors">
              🔐 Login as Admin →
            </button>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-4">
          By {isLogin ? 'signing in' : 'signing up'}, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
