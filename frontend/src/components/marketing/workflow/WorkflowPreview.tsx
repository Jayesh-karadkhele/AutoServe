import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Surface } from '@/components/ui/Surface';

export const WorkflowPreview: React.FC = () => {
  const steps = [
    { num: '01', title: 'Add Vehicle', desc: 'Register vehicle details, license plate, and service history.' },
    { num: '02', title: 'Book Service', desc: 'Select preferred date, time slot, and describe symptoms or RSA.' },
    { num: '03', title: 'Review & Assign', desc: 'Manager confirms slot and assigns lead mechanic to workshop bay.' },
    { num: '04', title: 'Diagnose & Repair', desc: 'Mechanic inspects vehicle, uploads photos, and executes job card.' },
    { num: '05', title: 'Verify Work', desc: 'Manager checks evidence and locks itemized snapshot pricing.' },
    { num: '06', title: 'Pay Securely', desc: 'Customer receives digital invoice and pays via Razorpay gateway.' },
    { num: '07', title: 'Rate Experience', desc: 'Customer collects vehicle and submits service rating & feedback.' },
  ];

  return (
    <Section id="how-it-works" className="bg-[#F7F5EF] border-t border-[#17212B]/08 py-20 lg:py-28">
      <Container size="xl">
        <div className="max-w-3xl mb-12">
          <Badge variant="cyan" className="mb-4">
            SERVICE WORKFLOW PREVIEW
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            From request to road-ready.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4">
            Seven connected steps ensure transparency for vehicle owners, mechanics, managers, and administrators.
          </p>
        </div>

        {/* 7 Workflow Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <Surface
              key={step.num}
              variant="surface"
              elevation="xs"
              className="p-6 flex flex-col justify-between hover:border-[#00A7B5]/40 transition-all"
            >
              <div>
                <div className="text-xs font-mono-tech text-[#00A7B5] font-bold mb-2">
                  STEP {step.num}
                </div>
                <h3 className="text-lg font-display font-semibold text-[#17212B] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#66737E] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#17212B]/06 text-[10px] font-mono-tech text-[#66737E]">
                PART 6C INTERACTIVE JOURNEY
              </div>
            </Surface>
          ))}
        </div>
      </Container>
    </Section>
  );
};
