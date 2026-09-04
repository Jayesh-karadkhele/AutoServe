import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { FAQ_ITEMS } from './faqData';
import { FaqAccordionItem } from './FaqAccordionItem';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const handleToggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <Section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="py-20 sm:py-28 bg-[#F7F5EF] border-t border-slate-200/80 relative overflow-hidden"
    >
      <Container size="xl" className="space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="cyan" className="mb-4">
            BEFORE YOU BOOK
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            Questions, clearly answered.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4">
            Understand how booking, service tracking, role access, repair evidence and payments are designed to work across AutoServe.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="max-w-4xl bg-white border border-slate-200/90 rounded-2xl p-2 sm:p-4 shadow-sm">
          {FAQ_ITEMS.map((item) => (
            <FaqAccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
