import React, { useState } from 'react';
import type { CreateStaffPayload, UserSummary } from '../types/adminTypes';
import { adminApi } from '../api/adminApi';

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSummary) => void;
  managers: UserSummary[];
}

export const CreateStaffModal: React.FC<CreateStaffModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  managers,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'MANAGER' | 'MECHANIC'>('MANAGER');
  const [initialPassword, setInitialPassword] = useState('');
  const [managerId, setManagerId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !mobile || !initialPassword) {
      setError('Please fill in all mandatory fields');
      return;
    }

    if (role === 'MECHANIC' && !managerId) {
      setError('Manager assignment is mandatory when creating a Mechanic');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload: CreateStaffPayload = {
        fullName,
        email,
        mobile,
        role,
        initialPassword,
        managerId: role === 'MECHANIC' ? managerId : undefined,
        activeState: true,
      };

      const newUser = await adminApi.createStaff(payload);
      onSuccess(newUser);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create staff account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create Staff Account</h3>
            <p className="text-xs text-slate-500">Admin-Only Manager or Mechanic Registration</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Robert Smith"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@autoserve.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role Assignment</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'MANAGER' | 'MECHANIC')}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              >
                <option value="MANAGER">Workshop Manager</option>
                <option value="MECHANIC">Mechanic Technician</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password</label>
              <input
                type="password"
                value={initialPassword}
                onChange={(e) => setInitialPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {role === 'MECHANIC' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Workshop Manager</label>
              <select
                value={managerId || ''}
                onChange={(e) => setManagerId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                required
              >
                <option value="">-- Select Active Manager --</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Staff Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
