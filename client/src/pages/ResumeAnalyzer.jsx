import { useState } from 'react';
import api from '../api/axios';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!file || !targetRole) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('target_role', targetRole);
      const res = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? 'text-green-400' : s >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-1">Resume Analyzer</h2>
      <p className="text-gray-400 mb-6">Get AI-powered feedback on your resume</p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Upload Resume (PDF)</label>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-indigo-600 file:text-white file:text-sm" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Target Role</label>
            <input type="text" placeholder="e.g. SDE Intern, Backend Engineer"
              value={targetRole} onChange={e => setTargetRole(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
        <button onClick={analyze} disabled={!file || !targetRole || loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${scoreColor(result.matchScore)}`}>{result.matchScore}</div>
              <div className="text-gray-400 text-sm mt-1">Match Score</div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-800 rounded-full h-3">
                <div className={`h-3 rounded-full ${result.matchScore >= 80 ? 'bg-green-500' : result.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${result.matchScore}%` }} />
              </div>
            </div>
          </div>

          {result.strengths?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">✅ Strengths</h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => <li key={i} className="text-gray-300 text-sm">• {s}</li>)}
              </ul>
            </div>
          )}

          {result.missingKeywords?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">🔍 Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((k, i) => (
                  <span key={i} className="bg-red-900/30 border border-red-700 text-red-400 text-xs px-3 py-1 rounded-full">{k}</span>
                ))}
              </div>
            </div>
          )}

          {result.weakBullets?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">✍️ Rewritten Bullets</h3>
              <div className="space-y-4">
                {result.weakBullets.map((b, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg p-4">
                    <div className="text-red-400 text-sm mb-2 line-through">{b.original}</div>
                    <div className="text-green-400 text-sm">{b.rewritten}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.overallFeedback && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">💡 Overall Feedback</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{result.overallFeedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}