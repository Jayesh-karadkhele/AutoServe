import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  Wrench,
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface MechanicShellProps {
  children: React.ReactNode;
  pageTitle: string;
  breadcrumbs?: { label: string; href?: string }[];
  activeJobId?: number;
}

export const MechanicShell: React.FC<MechanicShellProps> = ({
  children,
  pageTitle,
  breadcrumbs = [],
  activeJobId,
}) => {
  const { user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Today Workspace', href: '/mechanic', icon: LayoutDashboard },
    { label: 'My Assigned Jobs', href: '/mechanic/jobs', icon: ClipboardList },
    { label: 'Completed Jobs', href: '/mechanic/completed', icon: CheckCircle2 },
    { label: 'My Profile', href: '/mechanic/profile', icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    await logoutAll();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1F2937] flex flex-col font-sans antialiased">
      {/* Accessible Skip Link */}
      <a
        href="#main-mechanic-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0284C7] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0284C7]"
      >
        Skip to main content
      </a>

      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
            aria-label="Open navigation drawer"
            aria-expanded={mobileDrawerOpen}
            aria-controls="mobile-mechanic-drawer"
          >
            {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link
            to="/mechanic"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] rounded-md px-1 py-0.5"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0284C7] to-[#06B6D4] text-white flex items-center justify-center font-black text-lg shadow-sm">
              M
            </span>
            <span className="font-extrabold text-[#111827] font-sans">
              Auto<span className="text-[#0284C7]">Serve</span>
            </span>
            <span className="ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
              Mechanic Workbench
            </span>
          </Link>

          {activeJobId && (
            <Link
              to={`/mechanic/jobs/${activeJobId}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-bold rounded-full animate-pulse min-h-[36px]"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Active Job Card #{activeJobId}</span>
            </Link>
          )}
        </div>

        {/* User Account Controls */}
        <div className="relative flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-[#111827]">{user?.name || 'Mechanic User'}</span>
            <span className="text-xs text-[#6B7280]">{user?.email || 'mechanic@autoserve.com'}</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="p-1 rounded-full border-2 border-[#0284C7]/30 hover:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#F0F9FF]"
              aria-label="Mechanic account menu"
              aria-expanded={profileMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E5E7EB] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-[#F3F4F6]">
                  <p className="text-xs text-[#6B7280]">Signed in as</p>
                  <p className="text-sm font-bold text-[#111827] truncate">{user?.name}</p>
                  <p className="text-xs font-semibold text-[#0284C7] mt-0.5">Role: MECHANIC</p>
                </div>

                <Link
                  to="/mechanic/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] min-h-[44px]"
                >
                  <User className="w-4 h-4 text-[#6B7280]" />
                  <span>My Profile & Sessions</span>
                </Link>

                <div className="border-t border-[#F3F4F6] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2] min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogoutAll}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#991B1B] hover:bg-[#FEE2E2] min-h-[44px]"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Log Out All Sessions</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5E7EB] py-6 px-4 shrink-0">
          <nav className="space-y-1.5 flex-1" aria-label="Mechanic desktop navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 min-h-[44px] ${
                    isActive
                      ? 'bg-[#E0F2FE] text-[#0369A1] font-bold shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#0284C7]' : 'text-[#6B7280]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0369A1]">
              <Wrench className="w-4 h-4 text-[#0284C7]" />
              <span>Digital Workbench</span>
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Focus on assigned vehicle repairs. Complete diagnosis, parts usage, and evidence photos.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div
            id="mobile-mechanic-drawer"
            className="fixed inset-0 z-40 lg:hidden flex"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation drawer"
          >
            <div
              className="fixed inset-0 bg-[#111827]/40 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />

            <div className="relative flex flex-col w-4/5 max-w-sm bg-white h-full py-6 px-4 z-50 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#0284C7] text-white font-bold flex items-center justify-center text-sm">
                    M
                  </span>
                  <span className="font-bold text-base text-[#111827]">Mechanic Menu</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 text-[#6B7280] hover:text-[#111827] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2 flex-1" aria-label="Mechanic mobile navigation">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                        isActive ? 'bg-[#E0F2FE] text-[#0369A1]' : 'text-[#374151] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FEF2F2] text-[#DC2626] rounded-xl text-sm font-bold min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Page Content Area */}
        <main
          id="main-mechanic-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 focus:outline-none"
        >
          {/* Breadcrumbs & Title */}
          <div className="space-y-1">
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 text-xs text-[#6B7280]" aria-label="Breadcrumbs">
                <Link to="/mechanic" className="hover:text-[#111827]">
                  Workbench
                </Link>
                {breadcrumbs.map((bc, i) => (
                  <React.Fragment key={i}>
                    <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    {bc.href ? (
                      <Link to={bc.href} className="hover:text-[#111827]">
                        {bc.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[#111827]">{bc.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827]">
              {pageTitle}
            </h1>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};
