import { useEffect, useState } from 'react';
import api from '../api/axios';

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/companies/list')
      .then(r => setCompanies(r.data))
      .catch(err => console.error("Error loading company list:", err));
  }, []);

  const fetchProblems = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ company: selectedCompany });
      if (difficulty !== 'All') params.append('difficulty', difficulty);
      const res = await api.get(`/companies/filter?${params}`);
      setProblems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const diffColor = (d) => ({
    Easy: 'text-green-400', 
    Medium: 'text-yellow-400', 
    Hard: 'text-red-400'
  }[d] || 'text-gray-400');

  return (
    <div className="p-8 bg-gray-950 min-h-full text-white">
      <h2 className="text-2xl font-bold text-white mb-1">Company-Wise Problems</h2>
      <p className="text-gray-400 mb-6">Filter problems by your target company</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedCompany}
          onChange={e => setSelectedCompany(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm"
        >
          <option value="">Select Company</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm"
        >
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <button
          onClick={fetchProblems}
          disabled={!selectedCompany || loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </div>

      {problems.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-4 px-6 py-3 border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-gray-950">
            <span>Title</span><span>Topic</span><span>Difficulty</span><span>Link</span>
          </div>
          <div className="divide-y divide-gray-800">
            {problems.map(p => (
              <div key={p.id} className="grid grid-cols-4 px-6 py-4 hover:bg-gray-800/50 transition-colors items-center">
                <span className="text-white text-sm font-medium">{p.title}</span>
                <span className="text-gray-400 text-sm">{p.topic}</span>
                <span className={`text-sm font-semibold ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                <a 
                  href={p.platform_link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium text-sm"
                >
                  Solve →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {problems.length === 0 && selectedCompany && !loading && (
        <div className="text-center text-gray-500 border border-dashed border-gray-800 rounded-xl py-12">
          No problems found for selected filters.
        </div>
      )}
    </div>
  );
}