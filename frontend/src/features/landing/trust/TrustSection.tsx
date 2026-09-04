import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { TRUST_PRINCIPLES } from './trustData';
import { TrustPrincipleCard } from './TrustPrincipleCard';
import { ServiceRecordTrace } from './ServiceRecordTrace';

export const TrustSection: React.FC = () => {
  return (
    <Section
      id="trust"
      aria-label="Product Credibility & Governance Principles"
      className="py-20 sm:py-28 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200/80 relative overflow-hidden"
    >
      <Container size="xl" className="space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="cyan" className="mb-4">
            BUILT AROUND ACCOUNTABILITY
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            Confidence comes from clearer records and controlled access.
          </h2>
        </div>

        {/* 4 Credibility Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_PRINCIPLES.map((principle) => (
            <TrustPrincipleCard key={principle.id} principle={principle} />
          ))}
        </div>

        {/* End-to-End Operational Traceability Flow */}
        <ServiceRecordTrace />
      </Container>
    </Section>
  );
};
