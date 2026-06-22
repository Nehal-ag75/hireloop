import { useState } from 'react';
import api from '../api/axios';

export default function MockInterview() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  
  // Selection states
  const [company, setCompany] = useState('Google');
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('Data Structures & Algorithms');

  // Categorized List of ~50 Target Companies
  const companyOptions = {
    "Big Tech (FAANG+)": ["Google", "Amazon", "Meta", "Microsoft", "Netflix", "Apple", "NVIDIA", "Adobe", "Salesforce", "Oracle"],
    "FinTech & Quant Trading": ["Goldman Sachs", "Morgan Stanley", "JPMorgan Chase", "Jane Street", "Citadel", "Bloomberg", "Stripe", "PayPal", "Coinbase", "Square / Block"],
    "Ride-Sharing & Delivery": ["Uber", "Lyft", "Grab", "DoorDash", "Instacart", "Delivery Hero"],
    "Enterprise & Cloud SaaS": ["Atlassian", "Snowflake", "Datadog", "ServiceNow", "Splunk", "Twilio", "Zoom", "HubSpot", "Slack"],
    "Consumer Web & Social Media": ["Twitter / X", "LinkedIn", "Airbnb", "Spotify", "Pinterest", "Reddit", "Snapchat", "TikTok / ByteDance"],
    "Global Tech Services & Telecom": ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "IBM", "Cisco", "Intel"]
  };

  const start = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const res = await api.post('/interview/start', { company, difficulty, topic });
      setSessionId(res.data.id);
      if (res.data.conversation && res.data.conversation.length > 0) {
        setMessages(res.data.conversation);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initialize custom mock interview session.');
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!input.trim() || !sessionId) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await api.post(`/interview/${sessionId}/respond`, { message: input });
      if (res.data.conversation) {
        setMessages(res.data.conversation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (!sessionId) return;
    setEnding(true);
    try {
      const res = await api.post(`/interview/${sessionId}/end`);
      if (res.data.scorecard) {
        const parsedScore = typeof res.data.scorecard === 'string' 
          ? JSON.parse(res.data.scorecard) 
          : res.data.scorecard;
        setScorecard(parsedScore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnding(false);
    }
  };

  if (!started) return (
    <div className="p-8 flex flex-col items-center justify-center h-full">
      <div className="text-center w-full max-w-xl bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-white mb-2">Adaptive Technical Mock Interview</h2>
        <p className="text-gray-400 mb-6 font-normal text-sm">Select target companies and foundational computer science pillars to generate dynamic, randomized technical tracks.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Target Company (~50 Options)</label>
            <select 
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              {Object.entries(companyOptions).map(([category, list]) => (
                <optgroup key={category} label={category} className="bg-gray-900 text-indigo-400 font-semibold">
                  {list.map(comp => (
                    <option key={comp} value={comp} className="text-white font-normal">{comp}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Difficulty Tier</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="Easy">Easy (Fundamentals)</option>
              <option value="Medium">Medium (Core Engineering)</option>
              <option value="Hard">Hard (Senior Assessment)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Technical Core Domain Focus</label>
            <select 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="Data Structures & Algorithms">Data Structures & Algorithms (DSA)</option>
              <option value="Object-Oriented Programming (OOPS)">Object-Oriented Programming (OOPS)</option>
              <option value="Operating Systems (OS)">Operating Systems (OS Concepts)</option>
              <option value="Computer Networks (CN)">Computer Networks (CN Stack)</option>
              <option value="Database Management Systems (DBMS)">Database Management Systems (DBMS / SQL)</option>
              <option value="Software Engineering & System Design">Software Engineering & System Architecture</option>
            </select>
          </div>
        </div>

        <button onClick={start} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
          Initialize Adaptive Mock Interview
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 flex gap-6 h-full items-start">
      <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden h-[75vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
          <div>
            <h3 className="text-white font-medium">{company} Style Technical Panel</h3>
            <p className="text-xs text-gray-400">Difficulty: <span className="text-indigo-400 font-semibold">{difficulty}</span> | Pillar: <span className="text-gray-300 font-medium">{topic}</span></p>
          </div>
          {(!scorecard && !ending) && (
            <button 
              onClick={endInterview} 
              className="bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-800/50 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            >
              Submit & Grade Session
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl px-4 py-3 rounded-xl text-sm whitespace-pre-wrap shadow-sm ${
                m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/40 text-gray-500 border border-gray-800/50 text-xs px-4 py-2.5 rounded-xl animate-pulse">
                Interviewer is evaluating response contexts...
              </div>
            </div>
          )}
          {ending && (
            <div className="flex justify-center p-4">
              <div className="bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 text-sm px-6 py-4 rounded-xl text-center max-w-sm">
                ⚙️ Executing scorecard cross-compilation routines...
              </div>
            </div>
          )}
        </div>
        
        {(!scorecard && !ending) && (
          <div className="p-4 border-t border-gray-800 flex gap-3 bg-gray-950">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={loading ? "Analyzing..." : "Enter programmatic logic, queries, or comprehensive explanations..."}
              disabled={loading}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50 font-medium">
              Send
            </button>
          </div>
        )}
      </div>

      {scorecard && (
        <div className="w-80 bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
            📊 Metric Evaluation
          </h3>
          <div className="space-y-4">
            {Object.entries(scorecard).map(([criterion, val]) => {
              const scoreValue = typeof val === 'object' && val !== null ? val.score || 0 : val;
              const numericScore = Number(scoreValue) || 0;
              return (
                <div key={criterion} className="mb-1">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400 capitalize">{criterion.replace(/_/g, ' ')}</span>
                    <span className="text-indigo-400 font-semibold">{numericScore}/10</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2 w-full">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(numericScore * 10, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            onClick={() => {
              setStarted(false);
              setScorecard(null);
              setMessages([]);
              setSessionId(null);
            }} 
            className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium py-2.5 rounded-lg border border-gray-700 transition-colors"
          >
            Start Another Board
          </button>
        </div>
      )}
    </div>
  );
}