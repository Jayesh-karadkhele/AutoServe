import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/ui/BrandMark';
import { Wordmark } from '@/components/ui/Wordmark';
import { Container } from '@/components/ui/Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" aria-label="Page Footer" className="border-t border-[#17212B]/10 bg-white py-14">
      <Container size="xl" className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Positioning */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <BrandMark size={30} />
              <Wordmark />
            </Link>
            <p className="text-xs text-[#66737E] leading-relaxed max-w-sm font-body">
              Connected vehicle-service management for customers and workshop teams. Bringing booking, live stage tracking, repair evidence, and itemized billing into one record.
            </p>
          </div>

          {/* Column 2: Product Navigation Anchors */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#17212B]">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#66737E]">
              <li>
                <a href="#why-autoserve" className="hover:text-[#17212B] transition-colors">
                  Why AutoServe
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[#17212B] transition-colors">
                  Experience
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#17212B] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-[#17212B] transition-colors">
                  For Every Role
                </a>
              </li>
              <li>
                <a href="#repair-evidence" className="hover:text-[#17212B] transition-colors">
                  Repair Evidence
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#17212B] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer & Access Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#17212B]">
              Account Access
            </h4>
            <ul className="space-y-2 text-xs text-[#66737E]">
              <li>
                <Link to="/register" className="hover:text-[#17212B] transition-colors">
                  Create Customer Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#17212B] transition-colors">
                  Sign In to Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Product Status Disclosure & Legal Baseline */}
        <div className="pt-8 border-t border-[#17212B]/08 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#66737E]">
          <p className="text-[11px] leading-relaxed max-w-2xl font-mono-tech">
            AutoServe is an evolving full-stack vehicle-service platform. Some experiences shown on this landing page are illustrative or planned previews.
          </p>
          <div className="font-mono-tech shrink-0">
            © {currentYear} AutoServe. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};
