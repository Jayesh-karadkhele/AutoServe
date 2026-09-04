import React from 'react';
import { Check, X } from 'lucide-react';
import type { PasswordRequirementsState } from '../validation/authValidation';

interface PasswordRequirementsProps {
  requirements: PasswordRequirementsState;
  confirmPassword?: string;
  password?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  requirements,
  confirmPassword,
  password,
}) => {
  const items = [
    { label: '8 to 72 characters long', valid: requirements.hasMinLength },
    { label: 'At least one uppercase letter (A-Z)', valid: requirements.hasUppercase },
    { label: 'At least one lowercase letter (a-z)', valid: requirements.hasLowercase },
    { label: 'At least one number (0-9)', valid: requirements.hasNumber },
    { label: 'At least one special character (!@#$%^&*)', valid: requirements.hasSpecialChar },
  ];

  const hasConfirm = typeof confirmPassword === 'string';
  const passwordsMatch = hasConfirm && confirmPassword.length > 0 && confirmPassword === password;

  return (
    <div
      aria-label="Password security requirements checklist"
      className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 space-y-2 text-xs"
    >
      <p className="font-semibold text-slate-700">Password requirements:</p>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              item.valid ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {item.valid ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            )}
            <span>{item.label}</span>
          </li>
        ))}

        {hasConfirm && (
          <li
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              passwordsMatch ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {passwordsMatch ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            )}
            <span>Passwords match</span>
          </li>
        )}
      </ul>
    </div>
  );
};
