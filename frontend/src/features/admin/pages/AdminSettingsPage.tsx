import React from 'react';
import { AdminShell } from '../components/AdminShell';
import { useSystemSettings } from '../hooks/useAdminData';

export const AdminSettingsPage: React.FC = () => {
  const { settings, loading, error } = useSystemSettings();

  return (
    <AdminShell title="Safe Platform Configuration & Telemetry">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Environment & Security Status</h2>
          <p className="text-xs text-slate-500 mt-1">
            Read-only platform configuration status. Secrets, JWT signing keys, and database passwords are zero-exposed.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading system settings...</div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs">{error}</div>
        ) : settings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Application Environment</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Active Profile:</span>
                  <span className="font-mono font-bold text-slate-900">{settings.activeProfile}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Platform Label:</span>
                  <span className="font-semibold text-slate-900">{settings.environmentLabel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Flyway Schema Version:</span>
                  <span className="font-mono font-bold text-violet-700">{settings.flywaySchemaVersion}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">App Build Version:</span>
                  <span className="font-mono text-slate-800">{settings.applicationVersion}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Integrations & Security</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Database Connectivity:</span>
                  <span className="font-semibold text-emerald-700">{settings.databaseConnectivity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Mail Subsystem:</span>
                  <span className="font-semibold text-emerald-700">
                    {settings.mailConfigured ? 'Configured (SMTP)' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Cloudinary Media Provider:</span>
                  <span className="font-semibold text-emerald-700">
                    {settings.cloudinaryConfigured ? 'Configured (Active)' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Razorpay Payment Gateway:</span>
                  <span className="font-semibold text-amber-700">
                    {settings.razorpayConfigured ? 'Active' : 'Planned (Part 8E)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Auth Refresh Security Mode:</span>
                  <span className="font-mono text-xs text-slate-800">{settings.authCookieSecurityMode}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
};
