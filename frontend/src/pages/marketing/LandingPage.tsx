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
import { FaqSection } from '@/features/landing/faq/FaqSection';
import { FinalCtaSection } from '@/features/landing/cta/FinalCtaSection';
import { Footer } from '@/components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17212B] flex flex-col font-body">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#F4512C] text-white rounded-lg font-mono-tech text-xs shadow-lg"
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
        <FaqSection />
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

