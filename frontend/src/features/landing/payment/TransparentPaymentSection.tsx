import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { InvoicePreview } from './InvoicePreview';
import { PaymentStatusPath } from './PaymentStatusPath';

export const TransparentPaymentSection: React.FC = () => {
  return (
    <Section
      id="transparent-payment"
      aria-label="Transparent Payment & Invoice Experience"
      className="py-20 sm:py-28 bg-gradient-to-b from-white via-slate-50 to-cyan-50/20 border-t border-slate-200/80 relative overflow-hidden"
    >
      <Container size="xl" className="space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="cyan" className="mb-4">
            CLEAR BEFORE YOU PAY
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            Every rupee has a reason.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4">
            Parts, labour, tax and adjustments are presented as one connected breakdown before the payment step.
          </p>
        </div>

        {/* Invoice Preview & Cost Line Explainer */}
        <InvoicePreview />

        {/* Payment Journey Sequence & Disclaimer */}
        <PaymentStatusPath />
      </Container>
    </Section>
  );
};
