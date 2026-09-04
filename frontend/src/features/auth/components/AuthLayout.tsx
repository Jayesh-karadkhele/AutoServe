import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { AuthVisual } from './AuthVisual';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Skip link for accessibility */}
      <a
        href="#auth-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-500 focus:text-slate-950 focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
      >
        Skip to main authentication form
      </a>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-md">
              <Shield className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Auto<span className="text-amber-600">Serve</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Authentication Grid */}
      <main id="auth-main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-160px)] items-center gap-8 lg:grid-cols-12">
          {/* Form Container (Left Column) */}
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
              <div className="mb-6 space-y-1.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {title}
                </h1>
                <p className="text-sm font-medium text-slate-600">{subtitle}</p>
              </div>

              {children}
            </div>
          </div>

          {/* Visual Showcase (Right Column - Hidden on mobile) */}
          <div className="h-full lg:col-span-6 xl:col-span-7">
            <AuthVisual />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs font-medium text-slate-500">
        <div className="mx-auto max-w-7xl px-4">
          <p>© {new Date().getFullYear()} AutoServe Platform. All rights reserved. Secure session lifecycle active.</p>
        </div>
      </footer>
    </div>
  );
};
