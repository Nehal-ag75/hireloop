import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background: 'linear-gradient(135deg, #c8d8e8 0%, #e8f0f8 50%, #d0e4f0 100%)'}}>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex" style={{minHeight: '420px'}}>
        <div className="w-5/12 flex flex-col justify-between p-10" style={{background: 'linear-gradient(160deg, #1a2a6c 0%, #1e3a8a 50%, #162456 100%)'}}>
          <div>
            <h1 className="text-3xl font-black text-white leading-tight mb-3">
              JOIN<br />
              <span style={{color: '#60a5fa'}}>HIRE</span><span className="text-white">LOOP</span>
            </h1>
            <div className="w-10 h-1 rounded-full mb-6" style={{background: '#3b82f6'}}></div>
          </div>
          <p className="text-sm font-light" style={{color: '#93c5fd'}}>
            Practice algorithms, validate metrics, and succeed in placement journeys.
          </p>
        </div>
        <div className="w-7/12 flex flex-col justify-center px-10 py-8">
          <h2 className="text-xl font-black text-gray-900 mb-1 tracking-tight uppercase">Create Account</h2>
          <p className="text-gray-500 text-sm mb-6">Start your placement prep journey</p>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg mb-4 text-xs">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50 mt-1 uppercase tracking-wider"
              style={{background: '#111827'}}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-gray-400 text-sm mt-5 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-bold" style={{color: '#3b82f6'}}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}