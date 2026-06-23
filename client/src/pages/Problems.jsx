import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, ExternalLink, CalendarClock, AlertCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://hireloop-backend-ad4x.onrender.com';
function getToken() { return localStorage.getItem('token'); }

function ReviewBadge({ dateStr }) {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = Math.round((target - today) / 86400000);
  let label, cls;
  if (diff < 0)      { label='Overdue';           cls='text-red-600 bg-red-50 border-red-200'; }
  else if (diff===0) { label='Due today';          cls='text-amber-700 bg-amber-50 border-amber-200'; }
  else if (diff===1) { label='Due tomorrow';       cls='text-sky-600 bg-sky-50 border-sky-200'; }
  else               { label=`Review in ${diff}d`; cls='text-ink-light bg-surface border-border'; }
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      <CalendarClock size={11}/>{label}
    </span>
  );
}

function diffColor(d) {
  if (d==='Easy')   return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (d==='Medium') return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-500 bg-red-50 border-red-200';
}

export default function Problems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const [problems, setProblems]       = useState([]);
  const [attempts, setAttempts]       = useState({});
  const [dueProblems, setDueProblems] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(null);
  const [toast, setToast]             = useState(null);
  const [failModal, setFailModal]     = useState(null);
  const [filters, setFilters]         = useState({ topic:'', difficulty:'' });
  const [showDueOnly, setShowDueOnly] = useState(filterParam==='due');

  useEffect(() => { setShowDueOnly(filterParam==='due'); }, [filterParam]);
  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const headers = { Authorization: `Bearer ${getToken()}` };
    try {
      const [probRes, histRes, dueRes] = await Promise.all([
        // ✅ correct endpoint — returns all DSA problems, no params needed
        axios.get(`${API}/api/roadmap/problems`, { headers }),
        axios.get(`${API}/api/attempts/history`,   { headers }).catch(()=>({data:[]})),
        axios.get(`${API}/api/attempts/due-today`, { headers }).catch(()=>({data:[]})),
      ]);

      setProblems(Array.isArray(probRes.data) ? probRes.data : []);
      setDueProblems(Array.isArray(dueRes.data) ? dueRes.data : []);

      const lookup = {};
      (histRes.data || []).forEach(a => {
        const pid = Number(a.problem_id);
        if (!lookup[pid] || new Date(a.submitted_at) > new Date(lookup[pid].submitted_at))
          lookup[pid] = a;
      });
      setAttempts(lookup);
    } catch(err) { console.error('fetchAll error:', err); }
    finally { setLoading(false); }
  }

  function showToast(msg, type='success') {
    setToast({msg, type});
    setTimeout(()=>setToast(null), 3000);
  }

  async function markSolved(problemId) {
    const pid = Number(problemId);
    if (!pid || submitting===pid) return;
    setSubmitting(pid);
    try {
      await axios.post(`${API}/api/attempts/submit`,
        { problem_id: pid, verdict:'Solved', time_taken_minutes: null },
        { headers:{ Authorization:`Bearer ${getToken()}` } });
      showToast('Marked as solved ✓');
      await fetchAll();
    } catch { showToast('Failed to save','error'); }
    finally { setSubmitting(null); }
  }

  async function submitFail({ problemId, timeTaken }) {
    const pid = Number(problemId);
    if (!pid) return;
    setSubmitting(pid);
    try {
      await axios.post(`${API}/api/attempts/submit`,
        { problem_id: pid, verdict:'Failed', time_taken_minutes: timeTaken||null },
        { headers:{ Authorization:`Bearer ${getToken()}` } });
      setFailModal(null);
      showToast('Logged — scheduled for review tomorrow');
      await fetchAll();
    } catch { showToast('Failed to save','error'); }
    finally { setSubmitting(null); }
  }

  const topics = useMemo(()=>[...new Set(problems.map(p=>p.topic))].sort(),[problems]);

  const filteredProblems = useMemo(()=>{
    let list = problems;
    if (filters.topic)      list = list.filter(p=>p.topic===filters.topic);
    if (filters.difficulty) list = list.filter(p=>p.difficulty===filters.difficulty);
    return list;
  },[problems, filters]);

  const displayList = showDueOnly ? dueProblems : filteredProblems;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold text-ink mb-1">Problem Bank</h1>
        <p className="text-ink-light text-[14px]">{problems.length} problems · {topics.length} topics</p>
      </div>

      {!showDueOnly && dueProblems.length > 0 && (
        <div className="mb-5 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 text-amber-800 text-[13px]">
            <AlertCircle size={15} className="text-amber-600 shrink-0"/>
            <span><strong>{dueProblems.length} problem{dueProblems.length>1?'s':''}</strong> due for review today</span>
          </div>
          <button onClick={()=>{setShowDueOnly(true);setSearchParams({filter:'due'});}}
            className="text-[12px] font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2">
            Review now →
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <button onClick={()=>{setShowDueOnly(false);setSearchParams({});}}
          className={`text-[13px] px-3 py-1.5 rounded-md border transition-colors ${!showDueOnly?'bg-ink text-white border-ink':'bg-white text-ink-light border-border hover:border-ink-light'}`}>
          All Problems
        </button>
        <button onClick={()=>{setShowDueOnly(true);setSearchParams({filter:'due'});}}
          className={`text-[13px] px-3 py-1.5 rounded-md border transition-colors flex items-center gap-1.5 ${showDueOnly?'bg-ink text-white border-ink':'bg-white text-ink-light border-border hover:border-ink-light'}`}>
          <CalendarClock size={13}/>Due Today
          {dueProblems.length>0 && (
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${showDueOnly?'bg-white/20 text-white':'bg-amber-100 text-amber-700'}`}>
              {dueProblems.length}
            </span>
          )}
        </button>
      </div>

      {!showDueOnly && (
        <div className="flex flex-wrap gap-2 mb-5">
          <select value={filters.topic} onChange={e=>setFilters(f=>({...f,topic:e.target.value}))}
            className="text-[13px] border border-border rounded-md px-3 py-1.5 bg-white text-ink focus:outline-none focus:border-accent">
            <option value="">All Topics</option>
            {topics.map(t=><option key={t}>{t}</option>)}
          </select>
          <select value={filters.difficulty} onChange={e=>setFilters(f=>({...f,difficulty:e.target.value}))}
            className="text-[13px] border border-border rounded-md px-3 py-1.5 bg-white text-ink focus:outline-none focus:border-accent">
            <option value="">All Difficulties</option>
            {['Easy','Medium','Hard'].map(d=><option key={d}>{d}</option>)}
          </select>
          {(filters.topic||filters.difficulty) && (
            <button onClick={()=>setFilters({topic:'',difficulty:''})}
              className="text-[12px] text-ink-light hover:text-ink underline underline-offset-2">Clear</button>
          )}
        </div>
      )}

      {showDueOnly && (
        <p className="text-[13px] text-ink-light mb-4">
          {dueProblems.length===0
            ? "You're all caught up — no problems due today."
            : `${dueProblems.length} problem${dueProblems.length>1?'s':''} scheduled for review`}
        </p>
      )}

      {loading ? (
        <div className="text-ink-light text-[14px] py-12 text-center">Loading…</div>
      ) : displayList.length===0 ? (
        <div className="text-center py-16 text-ink-light">
          {showDueOnly
            ? <><CalendarClock size={32} className="mx-auto mb-3 text-ink-light/30"/><p className="text-[15px] font-medium text-ink">All caught up!</p><p className="text-[13px]">No problems due for review today.</p></>
            : <p className="text-[14px]">No problems match your filters.</p>}
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          {displayList.map((row, idx) => {
            const pid     = Number(row.problem_id ?? row.id);
            const attempt = attempts[pid];
            const solved  = attempt?.verdict === 'Solved';
            const isSub   = submitting === pid;

            return (
              <div key={`${pid}-${idx}`}
                className={`flex items-center gap-4 px-4 py-3 bg-white hover:bg-surface/60 transition-colors ${idx!==displayList.length-1?'border-b border-border':''}`}>
                <span className="text-[12px] text-ink-light/40 w-6 shrink-0 text-right">{idx+1}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-medium text-ink">{row.title}</span>
                    <span className={`text-[11px] border px-1.5 py-0.5 rounded font-medium ${diffColor(row.difficulty)}`}>{row.difficulty}</span>
                    {attempt?.next_review_date && <ReviewBadge dateStr={attempt.next_review_date}/>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[12px] text-ink-light">{row.topic}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSub ? (
                    <span className="text-[12px] text-ink-light animate-pulse">Saving…</span>
                  ) : solved ? (
                    <span className="flex items-center gap-1 text-[12px] text-emerald-600 font-medium"><CheckCircle2 size={14}/>Solved</span>
                  ) : (
                    <>
                      <button onClick={()=>markSolved(pid)} disabled={isSub} title="Mark as solved"
                        className="w-7 h-7 flex items-center justify-center rounded border border-border hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 text-ink-light transition-colors disabled:opacity-40">
                        <CheckCircle2 size={14}/>
                      </button>
                      <button onClick={()=>setFailModal({problemId:pid, title:row.title})} disabled={isSub} title="Mark as failed"
                        className="w-7 h-7 flex items-center justify-center rounded border border-border hover:border-red-300 hover:bg-red-50 hover:text-red-500 text-ink-light transition-colors disabled:opacity-40">
                        <XCircle size={14}/>
                      </button>
                    </>
                  )}
                  <a href={row.platform_link} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded border border-border hover:border-accent hover:text-accent text-ink-light transition-colors">
                    <ExternalLink size={13}/>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {failModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-border shadow-lg w-full max-w-sm p-6">
            <h3 className="text-[16px] font-semibold text-ink mb-1">Log attempt</h3>
            <p className="text-[13px] text-ink-light mb-4"><span className="font-medium text-ink">{failModal.title}</span> — scheduled for review tomorrow.</p>
            <label className="block text-[12px] text-ink-light mb-1.5">Time spent (optional)</label>
            <input id="fail-time" type="number" min="1" placeholder="minutes, e.g. 30"
              className="w-full border border-border rounded-lg px-3 py-2 text-[14px] text-ink focus:outline-none focus:border-accent mb-4"/>
            <div className="flex gap-2">
              <button onClick={()=>setFailModal(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-[13px] text-ink-light hover:bg-surface">Cancel</button>
              <button onClick={()=>{const t=parseInt(document.getElementById('fail-time').value,10);submitFail({problemId:failModal.problemId,timeTaken:isNaN(t)?null:t});}}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium">Log as Failed</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-5 right-5 px-4 py-2.5 rounded-lg shadow-md text-[13px] font-medium text-white z-50 ${toast.type==='error'?'bg-red-500':'bg-ink'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
