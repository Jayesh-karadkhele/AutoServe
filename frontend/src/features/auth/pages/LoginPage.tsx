import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, UserCheck, Building2, Wrench, UserCog, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { AuthField } from '../components/AuthField';
import { PasswordField } from '../components/PasswordField';
import { AuthAlert } from '../components/AuthAlert';
import { AuthSubmitButton } from '../components/AuthSubmitButton';
import { validateEmail } from '../validation/authValidation';
import { getRoleDestination } from '../routing/roleUtils';

export type RoleType = 'CUSTOMER' | 'MANAGER' | 'MECHANIC' | 'ADMIN';

interface RoleOption {
  id: RoleType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeBorder: string;
  activeBg: string;
  activeRing: string;
  activeBadge: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'CUSTOMER',
    name: 'Customer',
    description: 'Book and track your vehicle service',
    icon: UserCheck,
    accentColor: 'text-amber-600',
    activeBorder: 'border-amber-500',
    activeBg: 'bg-amber-50/50',
    activeRing: 'focus-visible:ring-amber-500',
    activeBadge: 'bg-amber-100 text-amber-800 border-amber-200',
    title: 'Welcome back, Customer',
    subtitle: 'Sign in to your Customer dashboard to manage vehicles and appointments.',
    buttonLabel: 'Sign in as Customer',
  },
  {
    id: 'MANAGER',
    name: 'Manager',
    description: 'Coordinate appointments and workshop operations',
    icon: Building2,
    accentColor: 'text-sky-600',
    activeBorder: 'border-sky-500',
    activeBg: 'bg-sky-50/50',
    activeRing: 'focus-visible:ring-sky-500',
    activeBadge: 'bg-sky-100 text-sky-800 border-sky-200',
    title: 'Welcome back, Manager',
    subtitle: 'Sign in to your Manager workspace to oversee workshop operations.',
    buttonLabel: 'Sign in as Manager',
  },
  {
    id: 'MECHANIC',
    name: 'Mechanic',
    description: 'Access assigned jobs and repair tasks',
    icon: Wrench,
    accentColor: 'text-emerald-600',
    activeBorder: 'border-emerald-500',
    activeBg: 'bg-emerald-50/50',
    activeRing: 'focus-visible:ring-emerald-500',
    activeBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: 'Welcome back, Mechanic',
    subtitle: 'Sign in to your Mechanic workbench to access assigned jobs and repairs.',
    buttonLabel: 'Sign in as Mechanic',
  },
  {
    id: 'ADMIN',
    name: 'Admin',
    description: 'Manage users, teams and platform governance',
    icon: UserCog,
    accentColor: 'text-purple-600',
    activeBorder: 'border-purple-500',
    activeBg: 'bg-purple-50/50',
    activeRing: 'focus-visible:ring-purple-500',
    activeBadge: 'bg-purple-100 text-purple-800 border-purple-200',
    title: 'Welcome back, Admin',
    subtitle: 'Sign in to your Administrator workspace to govern platform access and audit.',
    buttonLabel: 'Sign in as Admin',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const stateLocation = location.state as { from?: string; message?: string; email?: string } | null;

  // Initialize selected role from non-sensitive UI preference if available, default to CUSTOMER
  const [selectedRole, setSelectedRole] = useState<RoleType>(() => {
    try {
      const saved = localStorage.getItem('autoserve_login_role_pref');
      if (saved && ['CUSTOMER', 'MANAGER', 'MECHANIC', 'ADMIN'].includes(saved)) {
        return saved as RoleType;
      }
    } catch {
      // Ignore storage restrictions
    }
    return 'CUSTOMER';
  });

  const [email, setEmail] = useState(stateLocation?.email || '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(stateLocation?.message || null);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roleCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeRoleOption = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const handleSelectRole = (roleId: RoleType) => {
    setSelectedRole(roleId);
    try {
      localStorage.setItem('autoserve_login_role_pref', roleId);
    } catch {
      // Non-critical preference save
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % ROLES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + ROLES.length) % ROLES.length;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleSelectRole(ROLES[index].id);
      return;
    } else {
      return;
    }

    const nextRole = ROLES[nextIndex].id;
    handleSelectRole(nextRole);
    setTimeout(() => {
      roleCardRefs.current[nextIndex]?.focus();
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setRedirectNotice(null);

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
      
      // Authoritative role from backend session
      const realRole = (user.role || '').toUpperCase().replace(/^ROLE_/, '') as RoleType;
      const targetPath = stateLocation?.from || getRoleDestination(realRole);

      // Check if selected UI card matches actual backend role
      if (selectedRole !== realRole) {
        const roleLabels: Record<string, string> = {
          CUSTOMER: 'Customer',
          MANAGER: 'Manager',
          MECHANIC: 'Mechanic',
          ADMIN: 'Admin',
        };
        const realLabel = roleLabels[realRole] || realRole;
        setRedirectNotice(`This account belongs to the ${realLabel} workspace. Redirecting securely.`);
        setTimeout(() => {
          navigate(targetPath, { replace: true });
        }, 1200);
      } else {
        navigate(targetPath, { replace: true });
      }
    } catch (err: unknown) {
      setIsLoading(false);

      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError.response?.status;

      if (status === 401) {
        setServerError('We couldn’t sign you in with those details.');
      } else if (status === 403) {
        setServerError(axiosError.response?.data?.message || 'Access denied or account disabled.');
      } else if (!status || status >= 500) {
        setServerError('AutoServe is temporarily unable to connect. Please try again.');
      } else {
        setServerError(axiosError.response?.data?.message || 'Failed to sign in. Please verify your input.');
      }
    }
  };

  return (
    <AuthLayout
      title={activeRoleOption.title}
      subtitle={activeRoleOption.subtitle}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Role Selector Radio Group */}
        <div className="space-y-2">
          <label id="login-as-label" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Login as
          </label>

          <div
            role="radiogroup"
            aria-labelledby="login-as-label"
            className="grid grid-cols-2 gap-2 lg:grid-cols-2 xl:grid-cols-4"
          >
            {ROLES.map((role, idx) => {
              const isSelected = selectedRole === role.id;
              const Icon = role.icon;

              return (
                <div
                  key={role.id}
                  ref={(el) => {
                    roleCardRefs.current[idx] = el;
                  }}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${role.name} — ${role.description}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelectRole(role.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`relative flex flex-col justify-between rounded-xl border p-3 cursor-pointer transition-all duration-150 motion-reduce:transition-none focus:outline-none ${role.activeRing} ${
                    isSelected
                      ? `${role.activeBorder} ${role.activeBg} shadow-xs ring-1 ${role.activeBorder}`
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100'} ${role.accentColor}`}>
                      <Icon className="h-4 w-4 stroke-[2.2]" />
                    </div>
                    {isSelected ? (
                      <span className="flex items-center text-emerald-600">
                        <CheckCircle2 className="h-4 w-4 fill-emerald-100" />
                      </span>
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-slate-300 bg-white" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{role.name}</h4>
                    <p className="text-[10px] leading-tight text-slate-500 mt-0.5">{role.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Alerts */}
        <AuthAlert message={serverError} />

        {redirectNotice && (
          <div
            className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium shadow-2xs flex items-center gap-2"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{redirectNotice}</span>
          </div>
        )}

        {/* Credentials Form */}
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

        <div className="space-y-1">
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
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-cyan-700 hover:text-cyan-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <AuthSubmitButton isLoading={isLoading}>
          {activeRoleOption.buttonLabel}
        </AuthSubmitButton>

        {/* Role-Specific Signup & Provisioning Notices */}
        <div className="pt-2 text-center text-xs text-slate-600 space-y-2 border-t border-slate-100 mt-4">
          {selectedRole === 'CUSTOMER' && (
            <p data-testid="customer-signup-notice">
              New Customer?{' '}
              <Link
                to="/register"
                className="font-bold text-amber-600 transition-colors hover:text-amber-700 focus:outline-none focus:underline"
              >
                Create your account
              </Link>
            </p>
          )}

          {selectedRole === 'MANAGER' && (
            <div className="space-y-1" data-testid="manager-signup-notice">
              <p className="font-semibold text-slate-700">Manager accounts are created by an authorized Administrator.</p>
              <p className="text-slate-500 text-[11px]">Already have your staff credentials? Sign in above.</p>
            </div>
          )}

          {selectedRole === 'MECHANIC' && (
            <div className="space-y-1" data-testid="mechanic-signup-notice">
              <p className="font-semibold text-slate-700">Mechanic accounts are created and assigned by an authorized Administrator.</p>
              <p className="text-slate-500 text-[11px]">Already have your staff credentials? Sign in above.</p>
            </div>
          )}

          {selectedRole === 'ADMIN' && (
            <div className="space-y-1" data-testid="admin-signup-notice">
              <p className="font-semibold text-slate-700">Administrator accounts are created through the secure bootstrap or authorized administrative workflow.</p>
              <p className="text-slate-500 text-[11px]">Already have your staff credentials? Sign in above.</p>
            </div>
          )}
        </div>
      </form>
    </AuthLayout>
  );
};
