import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { AuthField } from '../components/AuthField';
import { PasswordField } from '../components/PasswordField';
import { PasswordRequirements } from '../components/PasswordRequirements';
import { AuthAlert } from '../components/AuthAlert';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import {
  validateEmail,
  validateName,
  validatePhone,
  checkPasswordRequirements,
  isPasswordValid,
} from '../validation/authValidation';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordReqs = checkPasswordRequirements(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passwordValid = isPasswordValid(passwordReqs);
    const passwordErr = !passwordValid
      ? 'Password must meet all security requirements listed below'
      : null;
    const confirmErr =
      password !== confirmPassword ? 'Passwords do not match' : null;

    if (nameErr || emailErr || phoneErr || passwordErr || confirmErr) {
      setErrors({
        name: nameErr || undefined,
        email: emailErr || undefined,
        phone: phoneErr || undefined,
        password: passwordErr || undefined,
        confirmPassword: confirmErr || undefined,
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Send ONLY fields accepted by backend (name, email, password, phone)
      // Excludes role, salary, managerId, isActive, confirmPassword
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
      });

      // Successful registration -> Navigate to login with prefilled email in state
      navigate('/login', {
        state: {
          message: 'Account created successfully! Please sign in with your credentials.',
          email: email.trim(),
        },
      });
    } catch (err: unknown) {
      setIsLoading(false);

      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError.response?.status;

      if (status === 409) {
        setServerError('An account with this email address already exists.');
      } else if (status === 400) {
        setServerError(axiosError.response?.data?.message || 'Invalid registration details provided.');
      } else if (!status || status >= 500) {
        setServerError('AutoServe is temporarily unable to connect. Please try again.');
      } else {
        setServerError(axiosError.response?.data?.message || 'Registration failed. Please verify your details.');
      }
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join AutoServe for transparent service, digital evidence & real-time tracking."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Customer Account Scope Notice */}
        <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50/70 p-3 text-xs text-sky-900">
          <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
          <span>
            <strong>Creates a Customer account.</strong> Staff accounts (Manager, Mechanic, Admin) are provisioned through authorized workflows.
          </span>
        </div>

        <AuthAlert message={serverError} />

        <AuthField
          id="register-name"
          name="name"
          type="text"
          label="Full name"
          placeholder="Alex Mercer"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
          icon={<User className="h-4 w-4" />}
          required
        />

        <AuthField
          id="register-email"
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

        <AuthField
          id="register-phone"
          name="phone"
          type="tel"
          label="Phone number"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          autoComplete="tel"
          hint="10-digit mobile number"
          icon={<Phone className="h-4 w-4" />}
          required
        />

        <PasswordField
          id="register-password"
          name="password"
          label="Password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
          required
        />

        <PasswordRequirements
          requirements={passwordReqs}
          password={password}
          confirmPassword={confirmPassword}
        />

        <PasswordField
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <AuthSubmitButton isLoading={isLoading}>
          Create Customer Account
        </AuthSubmitButton>

        <div className="pt-2 text-center text-xs text-slate-600">
          <p>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-amber-600 transition-colors hover:text-amber-700 focus:outline-none focus:underline"
            >
              Sign in to AutoServe
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
