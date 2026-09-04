import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandMark } from '@/components/ui/BrandMark';
import { Wordmark } from '@/components/ui/Wordmark';
import { Button } from '@/components/ui/Button';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  navLinks,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Body scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#17212B]/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#F7F5EF] shadow-2xl flex flex-col z-50 p-6 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#17212B]/10">
              <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
                <BrandMark size={28} />
                <Wordmark />
              </Link>
              <button
                onClick={onClose}
                aria-label="Close Navigation Menu"
                className="p-2.5 rounded-lg text-[#17212B] hover:bg-[#17212B]/05 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="py-8 flex flex-col gap-2 flex-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="px-4 py-3.5 rounded-xl text-lg font-display font-medium text-[#17212B] hover:bg-[#EAF7FA] hover:text-[#00A7B5] transition-all flex items-center justify-between min-h-[44px]"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </a>
              ))}
            </nav>

            {/* Actions Footer */}
            <div className="pt-6 border-t border-[#17212B]/10 flex flex-col gap-3">
              <Button
                href="/register"
                variant="primary"
                size="lg"
                withArrow
                className="w-full justify-center min-h-[48px]"
                onClick={onClose}
              >
                Book a Service
              </Button>
              <Button
                href="/login"
                variant="secondary"
                size="lg"
                className="w-full justify-center min-h-[48px]"
                onClick={onClose}
              >
                Sign In
              </Button>
              <div className="text-center pt-2">
                <span className="text-xs font-mono-tech text-[#66737E]">
                  AutoServe OS v1.0 • Connected Platform
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
