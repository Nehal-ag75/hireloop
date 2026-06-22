import { useState } from 'react';
import { Sparkles, Loader2, ExternalLink } from 'lucide-react';
import api from '../api/axios';

const topics = ['Arrays', 'Strings', 'Linked List', 'Stacks', 'Trees', 'Graphs', 'Dynamic Programming', 'Recursion', 'Binary Search', 'Heap', 'Backtracking', 'Greedy', 'Two Pointers', 'Sliding Window'];

const diffStyles = {
  Easy: 'text-success bg-green-50',
  Medium: 'text-warning bg-amber-50',
  Hard: 'text-danger bg-red-50',
};

export default function Roadmap() {
  const [form, setForm] = useState({ targetCompany: '', days: 30, weakTopics: [] });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleTopic = (t) => {
    setForm(f => ({
      ...f,
      weakTopics: f.weakTopics.includes(t) ? f.weakTopics.filter(x => x !== t) : [...f.weakTopics, t]
    }));
  };

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/roadmap/generate', form);
      setRoadmap(res.data);

      // Refresh stored user so Dashboard's days_left reflects the update without a re-login
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.days_left = form.days;
      user.target_company = form.targetCompany;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 py-8 max-w-4xl">
      <h1 className="text-[26px] font-semibold text-ink mb-1">Study Roadmap</h1>
      <p className="text-ink-light text-[14px] mb-6">Generate a personalized day-by-day plan using topological sort</p>

      <div className="bg-paper-card border border-line rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-[12.5px] font-medium text-ink-light mb-1.5 block">Target Company</label>
            <input
              type="text"
              placeholder="e.g. Google, Amazon"
              value={form.targetCompany}
              onChange={e => setForm({ ...form, targetCompany: e.target.value })}
              className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[14px] text-ink focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-[12.5px] font-medium text-ink-light mb-1.5 block">Days available: {form.days}</label>
            <input
              type="range" min="7" max="90" value={form.days}
              onChange={e => setForm({ ...form, days: parseInt(e.target.value) })}
              className="w-full accent-[#5B6CE8] mt-3"
            />
          </div>
        </div>

        <div>
          <label className="text-[12.5px] font-medium text-ink-light mb-2 block">Weak topics (prioritized first)</label>
          <div className="flex flex-wrap gap-1.5">
            {topics.map(t => (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                className={`px-2.5 py-1 rounded-full text-[12.5px] transition-colors border ${
                  form.weakTopics.includes(t)
                    ? 'bg-accent-soft border-accent text-accent font-medium'
                    : 'bg-paper border-line text-ink-light hover:bg-paper-hover'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-danger text-[13px] mt-4">{error}</div>
        )}

        <button
          onClick={generate}
          disabled={loading || !form.targetCompany}
          className="mt-5 flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-[13.5px] font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {loading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </div>

      {roadmap?.days?.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-ink-light text-[13px] mb-3">
            {roadmap.totalDays} days · {roadmap.roadmap?.length || 0} problems · ordered by {roadmap.topicOrder?.length || 0} topics
          </p>
          {roadmap.days.map((day) => (
            <div key={day.day} className="bg-paper-card border border-line rounded-xl p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="bg-accent text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  Day {day.day}
                </span>
                <span className="text-ink text-[13.5px] font-medium">{day.topic}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {day.problems?.map((p) => (
                  <a
                    key={p.id}
                    href={p.platform_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-paper hover:bg-paper-hover border border-line text-ink-light text-[12.5px] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {p.title}
                    <span className={`text-[10.5px] font-medium px-1.5 py-0.5 rounded-full ${diffStyles[p.difficulty] || ''}`}>
                      {p.difficulty}
                    </span>
                    <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
