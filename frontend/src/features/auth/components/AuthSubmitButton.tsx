import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children: React.ReactNode;
}

export const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
  isLoading,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      className={`relative inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65 ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
