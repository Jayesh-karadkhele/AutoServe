import React from 'react';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
  hint?: string;
  icon?: React.ReactNode;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  id,
  label,
  error,
  hint,
  icon,
  className = '',
  ...props
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const ariaDescribedBy = [
    error ? errorId : null,
    hint ? hintId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      <div className="relative rounded-lg shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy || undefined}
          className={`block w-full rounded-lg border bg-white py-2.5 ${
            icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/20'
          } ${className}`}
          {...props}
        />
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
