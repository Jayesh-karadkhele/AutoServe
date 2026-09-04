import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
  hint?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  error,
  hint,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const capsId = `${id}-caps`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const ariaDescribedBy = [
    error ? errorId : null,
    hint ? hintId : null,
    capsLockOn ? capsId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        {capsLockOn && (
          <span id={capsId} role="status" className="flex items-center gap-1 text-xs font-semibold text-amber-700">
            <AlertCircle className="h-3.5 w-3.5" />
            Caps Lock is ON
          </span>
        )}
      </div>

      <div className="relative rounded-lg shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Lock className="h-4 w-4" />
        </div>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy || undefined}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/20'
          } ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-sky-600"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
};
