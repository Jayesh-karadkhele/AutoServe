import React, { useState, useEffect } from 'react';
import { CustomerShell } from '../components/CustomerShell';
import { useCustomerProfile } from '../hooks/useCustomerProfile';
import { User, Phone, Mail, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { profile, isLoading, error, isSaving, saveSuccess, updateProfile } = useCustomerProfile();

  const [userName, setUserName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setUserName(profile.userName || '');
      setMobile(profile.mobile || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!userName.trim()) {
      setValidationError('Name cannot be empty.');
      return;
    }

    if (mobile && !/^[0-[#]?\d{8,15}$/.test(mobile.trim())) {
      setValidationError('Please enter a valid mobile number (8-15 digits).');
      return;
    }

    try {
      await updateProfile({
        userName: userName.trim(),
        mobile: mobile.trim(),
      });
    } catch {
      // Error handled by hook state
    }
  };

  return (
    <CustomerShell pageTitle="Customer Profile" breadcrumbs={[{ label: 'Profile' }]}>
      <div className="max-w-2xl mx-auto space-y-6">
        {isLoading && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 space-y-4 animate-pulse">
            <div className="h-10 bg-[#E5E7EB] rounded-xl w-1/3" />
            <div className="h-10 bg-[#E5E7EB] rounded-xl" />
            <div className="h-10 bg-[#E5E7EB] rounded-xl" />
          </div>
        )}

        {!isLoading && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#E5E7EB]">
              <div className="w-16 h-16 rounded-full bg-[#EA580C] text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {profile?.userName ? profile.userName.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#111827]">{profile?.userName}</h2>
                <p className="text-xs text-[#6B7280]">{profile?.email}</p>
                <span className="inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                  Role: {profile?.userRole || 'CUSTOMER'}
                </span>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-sm text-[#059669] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            {(error || validationError) && (
              <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="userName" className="block text-sm font-bold text-[#111827] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-[#9CA3AF] absolute left-3 top-3" />
                  <input
                    id="userName"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-bold text-[#111827] mb-1">
                  Mobile / Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-[#9CA3AF] absolute left-3 top-3" />
                  <input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-h-[44px]"
                  />
                </div>
              </div>

              {/* Read-only protected fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1">
                    Email Address (Read-only)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={profile?.email || ''}
                      className="w-full pl-9 pr-3 py-2 bg-[#F3F4F6] border border-[#E5E7EB] text-xs text-[#6B7280] rounded-xl cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1">
                    Account Role (Read-only)
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={profile?.userRole || 'CUSTOMER'}
                      className="w-full pl-9 pr-3 py-2 bg-[#F3F4F6] border border-[#E5E7EB] text-xs text-[#6B7280] rounded-xl cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Profile Updates'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CustomerShell>
  );
};
