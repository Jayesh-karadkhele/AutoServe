import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { AuthField } from '../components/AuthField';
import { PasswordField } from '../components/PasswordField';
import { AuthAlert } from '../components/AuthAlert';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { validateEmail } from '../validation/authValidation';

import { getRoleDestination } from '../routing/roleUtils';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Location state can pass prefilled email or redirect destination
  const stateLocation = location.state as { from?: string; message?: string; email?: string } | null;

  const [email, setEmail] = useState(stateLocation?.email || '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(stateLocation?.message || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const emailErr = validateEmail(email);
    const passwordErr = !password ? 'Password is required' : null;

    if (emailErr || passwordErr) {
      setErrors({
        email: emailErr || undefined,
        password: passwordErr || undefined,
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const user = await login({ email: email.trim(), password });
      
      // Determine role-based redirection path
      const targetPath = stateLocation?.from || getRoleDestination(user.role);
      navigate(targetPath, { replace: true });
    } catch (err: unknown) {
      setIsLoading(false);

      // Safe error mapping per security guidelines
      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError.response?.status;

      if (status === 401) {
        setServerError('We couldn’t sign you in with those details.');
      } else if (status === 403) {
        setServerError(axiosError.response?.data?.message || 'Access denied or invalid client request.');
      } else if (!status || status >= 500) {
        setServerError('AutoServe is temporarily unable to connect. Please try again.');
      } else {
        setServerError(axiosError.response?.data?.message || 'Failed to sign in. Please verify your input.');
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue where your vehicle’s service story left off."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthAlert message={serverError} />

        <AuthField
          id="login-email"
          name="email"
          type="email"
          label="Email address"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <PasswordField
          id="login-password"
          name="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
          required
        />

        <AuthSubmitButton isLoading={isLoading}>
          Sign in to AutoServe
        </AuthSubmitButton>

        <div className="pt-2 text-center text-xs text-slate-600 space-y-2">
          <p>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-amber-600 transition-colors hover:text-amber-700 focus:outline-none focus:underline"
            >
              Create a Customer account
            </Link>
          </p>
          <p className="text-slate-400 text-[11px]">
            Manager, Mechanic, and Admin accounts are created through authorized staff workflows.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
