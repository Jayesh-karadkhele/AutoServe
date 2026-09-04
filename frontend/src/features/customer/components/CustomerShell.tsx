import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Wrench,
  FileText,
  User,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface CustomerShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export const CustomerShell: React.FC<CustomerShellProps> = ({
  children,
  pageTitle = 'Dashboard',
  breadcrumbs = [],
}) => {
  const { user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigationItems = [
    { label: 'Overview', href: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My Vehicles', href: '/customer/vehicles', icon: Car },
    { label: 'Appointments', href: '/customer/appointments', icon: CalendarCheck },
    { label: 'Service Tracking', href: '/customer/service/active', icon: Wrench },
    { label: 'Invoices', href: '/customer/invoices', icon: FileText },
    { label: 'Profile', href: '/customer/profile', icon: User },
    { label: 'Roadside', href: '/customer/roadside', icon: ShieldAlert, badge: 'Planned' },
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
        href="#main-customer-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#EA580C] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C]"
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
            className="lg:hidden p-2 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-[#center] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link
            to="/customer/dashboard"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C] rounded-md px-1 py-0.5"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#F97316] text-white flex items-center justify-center font-black text-lg shadow-sm">
              A
            </span>
            <span className="font-extrabold text-[#111827]">
              Auto<span className="text-[#EA580C]">Serve</span>
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0F7FF] text-[#0284C7] border border-[#BAE6FD]">
              Customer Portal
            </span>
          </Link>
        </div>

        {/* User Badge & Profile Menu */}
        <div className="relative flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-[#111827]">{user?.name || 'Customer'}</span>
            <span className="text-xs text-[#6B7280]">{user?.email}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="p-1 rounded-full border-2 border-[#EA580C]/30 hover:border-[#EA580C] focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#FFF7ED]"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
            aria-label="User account menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white font-bold flex items-center justify-center text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#F3F4F6]">
                <p className="text-sm font-bold text-[#111827]">{user?.name}</p>
                <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                  <UserCheck className="w-3 h-3" /> Authenticated Customer
                </span>
              </div>
              <Link
                to="/customer/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <User className="w-4 h-4 text-[#6B7280]" /> Profile & Security
              </Link>
              <div className="border-t border-[#F3F4F6] my-1" />
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => handleLogout(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => handleLogout(true)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors text-left"
              >
                Sign Out All Devices
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5E7EB] py-6 px-4 shrink-0">
          <nav aria-label="Customer main navigation" className="space-y-1.5 flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/customer/dashboard' && location.pathname.startsWith(item.href));

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FFF7ED] text-[#EA580C] shadow-xs font-semibold'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#EA580C]' : 'text-[#6B7280]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#F3F4F6] px-2 text-xs text-[#9CA3AF]">
            AutoServe v2.4 Customer Module
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
                  <span className="font-bold text-[#111827]">AutoServe Menu</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#6B7280] hover:text-[#111827] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg"
                    aria-label="Close navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav aria-label="Mobile navigation" className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.href ||
                      (item.href !== '/customer/dashboard' && location.pathname.startsWith(item.href));

                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-base transition-colors min-h-[44px] ${
                          isActive
                            ? 'bg-[#FFF7ED] text-[#EA580C] font-semibold'
                            : 'text-[#374151] hover:bg-[#F9FAFB]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-[#EA580C]' : 'text-[#6B7280]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
                <button
                  type="button"
                  onClick={() => handleLogout(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] rounded-xl min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main id="main-customer-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Breadcrumbs & Header */}
          <div>
            {breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-2">
                <Link to="/customer/dashboard" className="hover:text-[#111827] transition-colors">
                  Home
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
            </div>
          </div>

          {/* Children Page View */}
          {children}
        </main>
      </div>
    </div>
  );
};
