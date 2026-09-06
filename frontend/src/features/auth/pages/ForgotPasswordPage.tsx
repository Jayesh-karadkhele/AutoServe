import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { accountSecurityApi } from '../api/accountSecurityApi';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await accountSecurityApi.forgotPassword({ email });
      setMessage(res.message);
      setSubmitted(true);
    } catch {
      setMessage('If an eligible account exists, password-reset instructions will be sent.');
      setSubmitted(true);
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
          <h2 className="mt-2 text-xl font-extrabold text-slate-800">Password Recovery</h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your registered account email to receive reset instructions
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl" role="alert">
                <p className="font-bold">Request Received</p>
                <p className="mt-1">{message}</p>
              </div>
              <p className="text-xs text-slate-500">
                Check your email inbox or use the reset token received to complete your password reset.
              </p>
              <div className="pt-2 text-center space-y-2">
                <Link
                  to="/reset-password"
                  className="block w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-xl text-center shadow-xs"
                >
                  Enter Reset Token
                </Link>
                <Link to="/login" className="inline-block text-xs font-semibold text-slate-600 hover:underline">
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
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
