import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
}

export const AdminShell: React.FC<AdminShellProps> = ({ children, title }) => {
  const { user, logout, logoutAll } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: '📊' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Managers', path: '/admin/managers', icon: '👔' },
    { label: 'Mechanics', path: '/admin/mechanics', icon: '🔧' },
    { label: 'Team Structure', path: '/admin/teams', icon: '🏢' },
    { label: 'Appointments', path: '/admin/appointments', icon: '📅' },
    { label: 'Job Cards', path: '/admin/job-cards', icon: '📋' },
    { label: 'Inventory', path: '/admin/inventory', icon: '📦' },
    { label: 'Invoices', path: '/admin/invoices', icon: '💳' },
    { label: 'Reports', path: '/admin/reports', icon: '📈' },
    { label: 'Audit Activity', path: '/admin/audit', icon: '🛡️' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
    { label: 'Profile', path: '/admin/profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans text-slate-800">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-cyan-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Top Governance Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation drawer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">AutoServe</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                Governance Centre
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-xs">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <span className="hidden md:inline">{user?.name || 'Platform Administrator'}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-violet-100 text-violet-800 rounded">
                      Role: Admin
                    </span>
                  </div>
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Admin Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Platform Settings
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Log Out
                  </button>
                  <button
                    onClick={() => {
                      logoutAll();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Log Out All Sessions
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-22 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Governance Menu
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-50 text-violet-900 font-semibold border-l-4 border-violet-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileDrawerOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white p-4 space-y-2 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900">Admin Governance</span>
                <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                  ✕
                </button>
              </div>
              <nav className="space-y-1 overflow-y-auto flex-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                        isActive ? 'bg-violet-50 text-violet-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
              <p className="text-xs text-slate-500 mt-1">Platform Governance, Staff Administration & Operational Oversight</p>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};
