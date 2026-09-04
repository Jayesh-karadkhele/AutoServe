import React from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Hero } from '@/components/marketing/Hero';
import { ServiceMarquee } from '@/components/marketing/ServiceMarquee';
import { ProblemStorySection } from '@/components/marketing/problem/ProblemStorySection';
import { TransformationBridge } from '@/components/marketing/TransformationBridge';
import { SolutionStorySection } from '@/components/marketing/solution/SolutionStorySection';
import { CapabilityRail } from '@/components/marketing/rail/CapabilityRail';
import { HowItWorksSection } from '@/features/landing/how-it-works/HowItWorksSection';
import { WorkOrderHandoff } from '@/features/landing/handoff/WorkOrderHandoff';
import { RoleExperienceSection } from '@/features/landing/roles/RoleExperienceSection';
import { RepairEvidenceSection } from '@/features/landing/evidence/RepairEvidenceSection';
import { TransparentPaymentSection } from '@/features/landing/payment/TransparentPaymentSection';
import { RoadsideAssistanceSection } from '@/features/landing/roadside/RoadsideAssistanceSection';
import { TrustSection } from '@/features/landing/trust/TrustSection';
import { Container } from '@/components/ui/Container';
import { BrandMark } from '@/components/ui/BrandMark';
import { Wordmark } from '@/components/ui/Wordmark';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17212B] flex flex-col font-body">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#F4512C] text-white rounded-lg font-mono-tech text-xs"
      >
        Skip to main content
      </a>

      {/* Main Floating Header */}
      <Navigation />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        <Hero />
        <ServiceMarquee />
        <ProblemStorySection />
        <TransformationBridge />
        <SolutionStorySection />
        <CapabilityRail />
        <HowItWorksSection />
        <WorkOrderHandoff />
        <RoleExperienceSection />
        <RepairEvidenceSection />
        <TransparentPaymentSection />
        <RoadsideAssistanceSection />
        <TrustSection />
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
              <a href="#roles" className="hover:text-[#17212B] transition-colors">
                For Every Role
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};
