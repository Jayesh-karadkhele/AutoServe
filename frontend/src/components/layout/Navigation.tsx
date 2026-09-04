import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { Wordmark } from '@/components/ui/Wordmark';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MobileNavigation } from './MobileNavigation';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/lib/utils';

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 20;

  const navLinks = [
    { label: 'Why AutoServe', href: '#why-autoserve' },
    { label: 'Experience', href: '#experience' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled ? 'py-3' : 'py-5 lg:py-6'
        )}
      >
        <Container size="xl">
          <nav
            aria-label="Main Navigation"
            className={cn(
              'mx-auto flex items-center justify-between transition-all duration-300 rounded-2xl px-4 sm:px-6 py-2.5 bg-white/90 backdrop-blur-md border',
              isScrolled
                ? 'border-[#17212B]/12 shadow-md shadow-[#17212B]/05'
                : 'border-[#17212B]/08 shadow-xs shadow-[#17212B]/03'
            )}
          >
            {/* Brand Logo & Wordmark */}
            <Link to="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C] rounded-lg p-1">
              <BrandMark size={32} />
              <Wordmark />
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#66737E]">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#17212B] transition-colors py-1.5 border-b-2 border-transparent hover:border-[#F4512C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C] rounded-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop CTA Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button href="/login" variant="ghost" size="sm">
                Sign In
              </Button>
              <Button href="/register" variant="primary" size="sm" withArrow>
                Book a Service
              </Button>
            </div>

            {/* Mobile Actions & Menu Trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button href="/register" variant="primary" size="sm" className="text-xs px-3 py-1.5">
                Book Service
              </Button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className="p-2 text-[#17212B] hover:bg-[#17212B]/05 rounded-lg transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C]"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
};
