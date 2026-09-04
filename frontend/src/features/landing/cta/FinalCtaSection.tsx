import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FinalCtaVisual } from './FinalCtaVisual';
import { ArrowRight } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <Section
      id="final-cta"
      aria-label="Final Service Booking Call to Action"
      className="py-20 sm:py-28 bg-gradient-to-b from-white via-cyan-50/20 to-slate-50 border-t border-slate-200/80 relative overflow-hidden"
    >
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: CTA Narrative & Action Buttons */}
          <div className="space-y-6">
            <Badge variant="cyan">
              YOUR NEXT SERVICE
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#17212B] tracking-tight leading-tight">
              Vehicle care should never leave you guessing.
            </h2>

            <p className="text-editorial-body text-[#66737E]">
              Create your customer account, add your vehicle and begin a service journey designed around clearer updates, documented work and understandable costs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button href="/register" variant="primary" size="lg" withArrow className="min-h-[48px] justify-center">
                Book your service
              </Button>
              <Button href="/login" variant="secondary" size="lg" className="min-h-[48px] justify-center">
                Sign in
              </Button>
            </div>

            {/* Tertiary Link */}
            <div className="pt-2">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-xs font-mono-tech font-semibold text-[#00A7B5] hover:text-[#17212B] transition-colors group"
              >
                <span>Explore how it works</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Code-Native Light SVG Settlement Visual */}
          <div>
            <FinalCtaVisual />
          </div>
        </div>
      </Container>
    </Section>
  );
};
