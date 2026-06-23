import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#B9D9EB] via-[#E8F1F5] to-[#FAFAFC] font-sans antialiased flex flex-col justify-center items-center py-8 px-4 selection:bg-[#4338CA]/10">
      
      {/* Central Split-Screen Premium Card */}
      <div className="w-full max-w-4xl bg-white rounded-[24px] shadow-xl shadow-slate-200/40 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch border border-[#E5E7EB]/50">
        
        {/* Left Side: Elegant Text-Driven Workspace Intro */}
        <div className="md:col-span-6 rounded-[18px] bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] flex flex-col justify-between p-8 md:p-12 relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-[1.1] uppercase font-sans">
              WELCOME TO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white font-extrabold tracking-wide">
                HIRELOOP
              </span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full mt-5" />
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <h2 className="text-lg sm:text-xl font-medium text-slate-200/90 tracking-tight leading-relaxed">
              Practice algorithms, validate metrics, and succeed in placement journeys.
            </h2>
          </div>
        </div>

        {/* Right Side: Clean Input Login Component Form */}
        <div className="md:col-span-6 flex flex-col justify-center px-6 py-8 sm:px-10">
          <div className="mb-6">
            <h3 className="text-xl font-black tracking-tight text-[#111827] uppercase">
              Welcome back
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Sign in to continue your prep
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Real Error Feedback Alert using your AlertCircle component */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-xl text-xs font-semibold">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#FAFAFC] text-xs px-4 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#4338CA] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#FAFAFC] text-xs px-4 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#4338CA] transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="accent-[#4338CA] rounded" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="hover:text-[#4338CA] transition-colors">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111827] hover:bg-[#111827]/90 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-colors duration-150 shadow-sm mt-4 uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-[#6B7280] border-t border-[#E5E7EB]/60 pt-4">
            Don't have an account? <Link to="/register" className="text-[#4338CA] font-bold hover:underline">Register</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
