import { useState } from 'react';
import api from '../api/axios';

const TARGET_ROLES = [
  'SDE Intern',
  'Software Engineer (SDE-1)',
  'Software Engineer (SDE-2)',
  'Senior Software Engineer (SDE-3)',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer (SRE)',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI/ML Researcher',
  'Android Engineer',
  'iOS Engineer',
  'Mobile Engineer',
  'Cloud Engineer',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Security Engineer',
  'Embedded Systems Engineer',
  'Systems Engineer',
  'Quant Developer',
  'Blockchain Developer',
  'Product Manager (Technical)',
  'Engineering Manager',
  'Solutions Architect',
  'Technical Program Manager',
];

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
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('target_role', targetRole);
      const res = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? 'text-green-400' : s >= 60 ? 'text-yellow-400' : 'text-red-400';
  const barColor = (s) => s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Resume Analyzer</h2>
      <p className="text-gray-400 mb-6">Get AI-powered feedback on your resume</p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files[0])}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-indigo-600 file:text-white file:text-sm cursor-pointer"
            />
            {file && <p className="text-gray-500 text-xs mt-1 truncate">{file.name}</p>}
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Target Role</label>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">Select a target role...</option>
              {TARGET_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={analyze}
          disabled={!file || !targetRole || loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Analyzing...
            </span>
          ) : 'Analyze Resume'}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Match Score */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-6">
            <div className="text-center shrink-0">
              <div className={`text-5xl font-bold ${scoreColor(result.matchScore)}`}>{result.matchScore}</div>
              <div className="text-gray-400 text-sm mt-1">Match Score</div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-800 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${barColor(result.matchScore)}`}
                  style={{ width: `${result.matchScore}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {result.matchScore >= 80 ? 'Strong match for this role' : result.matchScore >= 60 ? 'Moderate match — some gaps to address' : 'Significant gaps — focus on missing skills'}
              </p>
            </div>
          </div>

          {/* Strengths */}
          {result.strengths?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                ✅ Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Keywords */}
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

          {/* Weak Bullets */}
          {result.weakBullets?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">✏️ Rewritten Bullets</h3>
              <div className="space-y-4">
                {result.weakBullets.map((b, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Original</span>
                      <p className="text-red-400 text-sm mt-1 line-through">{b.original}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Improved</span>
                      <p className="text-green-400 text-sm mt-1">{b.improved || b.rewritten}</p>
                    </div>
                    {b.reason && (
                      <p className="text-gray-500 text-xs italic">{b.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overall Feedback */}
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
