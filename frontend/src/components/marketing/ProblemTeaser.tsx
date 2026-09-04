import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, EyeOff, PhoneOff } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Surface } from '@/components/ui/Surface';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const ProblemTeaser: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();

  const problems = [
    {
      icon: <AlertCircle className="w-6 h-6 text-[#F4512C]" />,
      title: 'Hidden Costs & Unclear Billing',
      description:
        'Vague verbal quotes that balloon into unexpected extra charges when you pick up your vehicle.',
      code: 'ERR_PRICING_OPAQUE',
    },
    {
      icon: <EyeOff className="w-6 h-6 text-[#00A7B5]" />,
      title: 'Zero Repair Visibility',
      description:
        'Dropping off your vehicle with zero photo or video proof of work actually being performed.',
      code: 'ERR_NO_EVIDENCE_LOG',
    },
    {
      icon: <PhoneOff className="w-6 h-6 text-[#E89B24]" />,
      title: 'Endless Follow-up Calls',
      description:
        'Calling workshop reception repeatedly just to ask if your car is ready for pickup.',
      code: 'ERR_MANUAL_CHASE',
    },
  ];

  return (
    <Section id="why-autoserve" className="bg-[#F2F7F8]/50 border-t border-[#17212B]/08">
      <Container size="xl">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="orange" className="mb-4">
            THE WORKSHOP PROBLEM
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            Car service shouldn’t feel like guesswork.
          </h2>
          <p className="text-editorial-body text-[#66737E] mt-4 max-w-2xl mx-auto">
            AutoServe replaces uncertainty, scattered calls, and surprise costs with one connected, transparent service experience.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: isReducedMotion ? 0 : 0.6,
                delay: isReducedMotion ? 0 : index * 0.15,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              <Surface
                variant="surface"
                elevation="xs"
                clippedCorner={index === 1}
                className="p-6 h-full flex flex-col justify-between hover:border-[#17212B]/25 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#F7F5EF] flex items-center justify-center border border-[#17212B]/08 group-hover:scale-105 transition-transform">
                      {problem.icon}
                    </div>
                    <span className="text-[10px] font-mono-tech text-[#66737E]">
                      {problem.code}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-semibold text-[#17212B] mb-3 group-hover:text-[#F4512C] transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-[#66737E] leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#17212B]/06 flex items-center justify-between text-xs font-mono-tech text-[#66737E]">
                  <span>CONVENTIONAL SERVICE</span>
                  <span className="text-[#F4512C] font-semibold">UNSOLVED</span>
                </div>
              </Surface>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
