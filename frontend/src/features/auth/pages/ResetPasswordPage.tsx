import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { accountSecurityApi } from '../api/accountSecurityApi';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Extract token from URL hash (#token=xxx) or query (?token=xxx) for backward compatibility
    let rawToken: string | null = null;
    const hash = window.location.hash;

    if (hash && hash.includes('token=')) {
      rawToken = new URLSearchParams(hash.substring(1)).get('token');
      // Immediately strip sensitive URL fragment from browser history and address bar
      window.history.replaceState(null, '', window.location.pathname);
    } else if (window.location.search && window.location.search.includes('token=')) {
      rawToken = new URLSearchParams(window.location.search).get('token');
      window.history.replaceState(null, '', window.location.pathname);
    }

    if (rawToken) {
      setToken(rawToken);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Please provide a valid password reset token');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await accountSecurityApi.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid or expired password reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight">
            AutoServe
          </Link>
          <h2 className="mt-2 text-xl font-extrabold text-slate-800">Set New Account Password</h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your reset token and choose a new secure password
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl" role="alert">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl text-center space-y-3" role="alert">
              <p className="font-bold">Password Reset Complete!</p>
              <p>Your password has been successfully updated. Redirecting to login...</p>
              <Link to="/login" className="inline-block px-4 py-2 bg-emerald-700 text-white font-semibold rounded-xl">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="resetToken" className="block text-xs font-semibold text-slate-700 mb-1">Reset Verification Token</label>
                <input
                  id="resetToken"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste raw reset token or URL fragment"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password & Revoke Sessions'}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs font-medium text-slate-500 hover:text-slate-700">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
