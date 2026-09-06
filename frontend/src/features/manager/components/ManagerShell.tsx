import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Wrench,
  Users,
  Boxes,
  FileText,
  BarChart3,
  Activity,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface ManagerShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  primaryAction?: { label: string; href?: string; onClick?: () => void };
}

export const ManagerShell: React.FC<ManagerShellProps> = ({
  children,
  pageTitle = 'Manager Control Tower',
  breadcrumbs = [],
  primaryAction,
}) => {
  const { user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigationItems = [
    { label: 'Overview', href: '/manager', icon: LayoutDashboard },
    { label: 'Appointments', href: '/manager/appointments', icon: CalendarCheck },
    { label: 'Job Cards', href: '/manager/job-cards', icon: Wrench },
    { label: 'Team Workspace', href: '/manager/team', icon: Users },
    { label: 'Inventory', href: '/manager/inventory', icon: Boxes },
    { label: 'Invoices', href: '/manager/invoices', icon: FileText },
    { label: 'Operational Reports', href: '/manager/reports', icon: BarChart3 },
    { label: 'Workshop Activity', href: '/manager/activity', icon: Activity },
    { label: 'Manager Profile', href: '/manager/profile', icon: User },
  ];

  const handleLogout = async (allSessions: boolean = false) => {
    setIsLoggingOut(true);
    try {
      if (allSessions) {
        await logoutAll();
      } else {
        await logout();
      }
      navigate('/login');
    } catch {
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1F2937] flex flex-col font-sans antialiased">
      {/* Skip Link for Keyboard Accessibility */}
      <a
        href="#main-manager-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0284C7] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0284C7]"
      >
        Skip to main content
      </a>

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-manager-drawer"
            aria-label={isMobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link
            to="/manager"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] rounded-md px-1 py-0.5"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0284C7] to-[#06B6D4] text-white flex items-center justify-center font-black text-lg shadow-sm">
              M
            </span>
            <span className="font-extrabold text-[#111827] font-sans">
              Auto<span className="text-[#0284C7]">Serve</span>
            </span>
            <span className="ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
              Workshop Manager
            </span>
          </Link>
        </div>

        {/* User Identity & Profile Controls */}
        <div className="relative flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-[#111827]">{user?.name || 'Manager'}</span>
            <span className="text-xs text-[#6B7280]">{user?.email}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="p-1 rounded-full border-2 border-[#0284C7]/30 hover:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#F0F9FF]"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
            aria-label="Manager account menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#F3F4F6]">
                <p className="text-sm font-bold text-[#111827]">{user?.name}</p>
                <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                  <ShieldCheck className="w-3 h-3" /> Workshop Control Role
                </span>
              </div>
              <Link
                to="/manager/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors min-h-[44px]"
              >
                <User className="w-4 h-4 text-[#6B7280]" /> Manager Profile
              </Link>
              <div className="border-t border-[#F3F4F6] my-1" />
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => handleLogout(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors text-left min-h-[44px]"
              >
                <LogOut className="w-4 h-4" /> Log Out Session
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => handleLogout(true)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors text-left min-h-[44px]"
              >
                Log Out All Sessions
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5E7EB] py-6 px-4 shrink-0">
          <nav aria-label="Manager desktop navigation" className="space-y-1.5 flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/manager' && location.pathname.startsWith(item.href));

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 min-h-[44px] ${
                    isActive
                      ? 'bg-[#F0F9FF] text-[#0284C7] shadow-xs font-bold border-l-4 border-[#0284C7]'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#0284C7]' : 'text-[#6B7280]'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#F3F4F6] px-2 text-xs text-[#9CA3AF] font-mono">
            AutoServe Operations v2.4
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-manager-drawer"
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
                  <span className="font-bold text-[#111827]">Manager Control Tower</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#6B7280] hover:text-[#111827] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg"
                    aria-label="Close navigation drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav aria-label="Mobile navigation" className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.href ||
                      (item.href !== '/manager' && location.pathname.startsWith(item.href));

                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-colors min-h-[44px] ${
                          isActive
                            ? 'bg-[#F0F9FF] text-[#0284C7] font-bold'
                            : 'text-[#374151] hover:bg-[#F9FAFB]'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#0284C7]' : 'text-[#6B7280]'}`} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
                <button
                  type="button"
                  onClick={() => handleLogout(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-xl min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" /> Sign Out Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Landmark Content Area */}
        <main id="main-manager-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Breadcrumbs & Header */}
          <div>
            {breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-2">
                <Link to="/manager" className="hover:text-[#111827] transition-colors">
                  Operations
                </Link>
                {breadcrumbs.map((b, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3 h-3 text-[#9CA3AF]" />
                    {b.href ? (
                      <Link to={b.href} className="hover:text-[#111827] transition-colors">
                        {b.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-[#111827]" aria-current="page">
                        {b.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
                {pageTitle}
              </h1>

              {primaryAction && (
                <div>
                  {primaryAction.href ? (
                    <Link
                      to={primaryAction.href}
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold text-sm rounded-xl transition-colors shadow-sm min-h-[44px]"
                    >
                      {primaryAction.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={primaryAction.onClick}
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold text-sm rounded-xl transition-colors shadow-sm min-h-[44px]"
                    >
                      {primaryAction.label}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Render Page View */}
          {children}
        </main>
      </div>
    </div>
  );
};
