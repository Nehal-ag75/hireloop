import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Code2, Mic, FileText, Building2, LogOut } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/roadmap', label: 'Roadmap', icon: Map },
  { path: '/problems', label: 'Problems', icon: Code2 },
  { path: '/mock-interview', label: 'Mock Interview', icon: Mic },
  { path: '/resume', label: 'Resume Analyzer', icon: FileText },
  { path: '/companies', label: 'Companies', icon: Building2 },
];

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initial = (user.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-paper text-ink">
      {/* Sidebar */}
      <aside className="w-60 bg-paper border-r border-line flex flex-col shrink-0">
        <div className="px-5 py-5">
          <div className="flex items-center gap-2.5">
           
            <h1 className="text-[15px] font-semibold text-ink tracking-tight">Hireloop</h1>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13.5px] transition-colors ${
                    isActive
                      ? 'bg-accent-soft text-accent font-medium'
                      : 'text-ink-light hover:bg-paper-hover hover:text-ink'
                  }`
                }
              >
                <Icon size={17} strokeWidth={2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-line">
          <div className="flex items-center gap-2.5 px-3 py-1.5 mb-1">
            <div className="w-6 h-6 rounded-full bg-line flex items-center justify-center text-[11px] font-medium text-ink-light shrink-0">
              {initial}
            </div>
            <span className="text-[13px] text-ink-light truncate">{user.name || 'User'}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13.5px] text-ink-light hover:bg-paper-hover hover:text-ink transition-colors"
          >
            <LogOut size={17} strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
