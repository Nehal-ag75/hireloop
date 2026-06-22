import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats/summary')
      .then(r => setStats(r.data))
      .catch(err => console.error('Failed to fetch stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {};

  return (
    <div className="px-10 py-8 max-w-5xl">
      <h1 className="text-[26px] font-semibold text-ink mb-1">Dashboard</h1>
      <p className="text-ink-light text-[14px] mb-8">Welcome back — here's where you stand today.</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Problems Solved"
          value={loading ? '—' : s.solved ?? 0}
          sub="unique problems"
          icon="✓"
          iconCls="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          label="Current Streak"
          value={loading ? '—' : s.streak ?? 0}
          sub="days in a row"
          icon="🔥"
          iconCls="text-orange-500 bg-orange-50"
        />
        <StatCard
          label="Topics Covered"
          value={loading ? '—' : s.topics ?? 0}
          sub="distinct topics"
          icon="📖"
          iconCls="text-indigo-500 bg-indigo-50"
        />
        <StatCard
          label="Days Remaining"
          value={loading ? '—' : s.daysLeft ?? '—'}
          sub="until target date"
          icon="📅"
          iconCls="text-sky-500 bg-sky-50"
        />
      </div>

      {/* Reviews due banner */}
      {!loading && s.reviewsDue > 0 && (
        <div className="mb-6 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <span className="text-[13px] text-amber-800">
            <strong>{s.reviewsDue} problem{s.reviewsDue > 1 ? 's' : ''}</strong> due for review today
          </span>
          <Link to="/problems?filter=due"
            className="text-[12px] font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2">
            Review now →
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ink-light mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard to="/problems"        title="Practice Problems"  sub="Browse the full problem bank" />
        <ActionCard to="/roadmap"         title="View Roadmap"       sub={s.daysLeft ? `${s.daysLeft} days remaining` : 'Generate your plan'} />
        <ActionCard to="/mock-interview"  title="Mock Interview"     sub="Practice with AI feedback" />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, iconCls }) {
  return (
    <div className="bg-paper-card border border-line rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-light">{label}</span>
        <span className={`text-[13px] w-7 h-7 flex items-center justify-center rounded-full ${iconCls}`}>{icon}</span>
      </div>
      <span className="text-[32px] font-bold text-ink leading-none">{value}</span>
      <span className="text-[12px] text-ink-light">{sub}</span>
    </div>
  );
}

function ActionCard({ to, title, sub }) {
  return (
    <Link to={to}
      className="bg-paper-card border border-line rounded-xl p-5 hover:border-accent hover:shadow-sm transition-all flex justify-between items-center group">
      <div>
        <h4 className="text-[14px] font-semibold text-ink mb-0.5">{title}</h4>
        <p className="text-[12px] text-ink-light">{sub}</p>
      </div>
      <span className="text-ink-light group-hover:text-accent transition-colors text-lg">→</span>
    </Link>
  );
}
