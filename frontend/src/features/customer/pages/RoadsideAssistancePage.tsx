import React from 'react';
import { Link } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { ShieldAlert, MapPin, Navigation, PhoneCall, ArrowLeft } from 'lucide-react';

export const RoadsideAssistancePage: React.FC = () => {
  return (
    <CustomerShell
      pageTitle="Roadside Assistance"
      breadcrumbs={[{ label: 'Roadside Assistance' }]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Planned Capability Banner */}
        <div className="bg-[#FFF7ED] border border-[#FDE68A] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-[#B45309]">
            <ShieldAlert className="w-8 h-8 shrink-0 text-[#EA580C]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#111827]">24/7 Breakdown Dispatch</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                  Planned capability
                </span>
              </div>
              <p className="text-xs text-[#92400E] mt-1 leading-relaxed">
                Live GPS dispatch and emergency roadside assistance integration is currently a planned feature preview.
              </p>
            </div>
          </div>

          <Link
            to="/customer/dashboard"
            className="px-4 py-2.5 bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB] font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>

        {/* Light Map / Dispatch Visual Preview */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#0284C7]" /> GPS Route Dispatch Concept
            </h3>
            <span className="text-xs text-[#6B7280]">Interactive Route Mockup</span>
          </div>

          <div className="relative w-full h-64 bg-[#F1F5F9] rounded-2xl border border-[#CBD5E1] overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-3">
            {/* Fine Automotive Grid Pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#0284C7 1px, transparent 1px), radial-gradient(#EA580C 1px, #F1F5F9 1px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
              }}
            />

            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto shadow-md">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="font-extrabold text-base text-[#0F172A]">
                GPS Location Detection Preview
              </h4>
              <p className="text-xs text-[#475569] max-w-md mx-auto leading-relaxed">
                When active, AutoServe Roadside Assistance will automatically pinpoint your breakdown coordinates and dispatch the nearest certified service vehicle.
              </p>
            </div>
          </div>

          <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4 text-xs text-[#991B1B] flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-[#7F1D1D]">Emergency Notice</p>
              <p className="mt-0.5">
                In case of immediate physical danger, medical emergency, or severe highway obstruction, please dial local emergency services (112 / 911) immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomerShell>
  );
};
