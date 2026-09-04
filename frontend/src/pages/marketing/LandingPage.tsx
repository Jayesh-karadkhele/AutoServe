import React from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Hero } from '@/components/marketing/Hero';
import { ServiceMarquee } from '@/components/marketing/ServiceMarquee';
import { ProblemTeaser } from '@/components/marketing/ProblemTeaser';
import { Container } from '@/components/ui/Container';
import { BrandMark } from '@/components/ui/BrandMark';
import { Wordmark } from '@/components/ui/Wordmark';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17212B] flex flex-col font-body">
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#F4512C] text-white rounded-lg font-mono-tech text-xs"
      >
        Skip to main content
      </a>

      {/* Main Navigation Header */}
      <Navigation />

      {/* Main Page Content */}
      <main id="main-content" className="flex-1">
        <Hero />
        <ServiceMarquee />
        <ProblemTeaser />
      </main>

      {/* Footer Baseline */}
      <footer className="border-t border-[#17212B]/10 bg-white py-12">
        <Container size="xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <BrandMark size={28} />
              <Wordmark />
            </div>

            <div className="text-xs font-mono-tech text-[#66737E]">
              © {new Date().getFullYear()} AutoServe Platform Inc. All rights reserved. • Re-engineered Vehicle Care
            </div>

            <div className="flex items-center gap-6 text-xs text-[#66737E]">
              <a href="#why-autoserve" className="hover:text-[#17212B] transition-colors">
                Why AutoServe
              </a>
              <a href="#experience" className="hover:text-[#17212B] transition-colors">
                Experience
              </a>
              <a href="#how-it-works" className="hover:text-[#17212B] transition-colors">
                How It Works
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};
