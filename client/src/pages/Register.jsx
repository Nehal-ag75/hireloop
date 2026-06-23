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
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        

        <div className="bg-paper-card border border-line rounded-xl shadow-card p-7">
          <h2 className="text-[19px] font-semibold text-ink mb-1">Create account</h2>
          <p className="text-ink-light text-[13.5px] mb-6">Start your placement prep journey</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-danger px-3 py-2 rounded-lg mb-4 text-[13px]">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[12.5px] font-medium text-ink-light mb-1.5 block">Full name</label>
              <input
                type="text"
                placeholder="Nehal"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[14px] text-ink placeholder-ink-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-ink-light mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[14px] text-ink placeholder-ink-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-ink-light mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[14px] text-ink placeholder-ink-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-medium text-[14px] py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-ink-light text-[13.5px] mt-5 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
