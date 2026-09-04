import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ServicePulseVisual } from './ServicePulseVisual';
import { ScrollIndicator } from './ScrollIndicator';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const Hero: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();

  // Motion variants
  const fadeInRise = {
    hidden: isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const containerStagger = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isReducedMotion ? 0 : 0.12,
        delayChildren: isReducedMotion ? 0 : 0.1,
      },
    },
  };

  return (
    <section className="relative min-h-[92dvh] pt-28 pb-16 lg:pt-36 lg:pb-20 flex flex-col justify-between overflow-hidden bg-tech-grid">
      {/* Background Soft Illumination Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#EAF7FA]/60 via-[#F7F5EF]/30 to-transparent blur-3xl pointer-events-none" />

      <Container size="xl" className="relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content Column */}
          <motion.div
            variants={containerStagger}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Eyebrow Badge */}
            <motion.div variants={fadeInRise} className="mb-6">
              <Badge variant="cyan" pulse>
                VEHICLE CARE, RE-ENGINEERED
              </Badge>
            </motion.div>

            {/* Main Editorial Headline */}
            <motion.h1
              variants={fadeInRise}
              className="text-hero-heading font-display font-bold text-[#17212B] tracking-tight mb-6"
            >
              Every service.<br />
              <span className="text-[#00A7B5]">Completely</span> in view.
            </motion.h1>

            {/* Supporting Paragraph */}
            <motion.p
              variants={fadeInRise}
              className="text-editorial-body text-[#66737E] mb-8 max-w-xl"
            >
              From booking and roadside assistance to live repair tracking and secure payments, AutoServe keeps every stage of vehicle care connected.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              variants={fadeInRise}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-6"
            >
              <Button href="/register" variant="primary" size="lg" withArrow>
                Book your service
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                See how it works
              </Button>
            </motion.div>

            {/* Utility Login Link */}
            <motion.div variants={fadeInRise} className="text-xs font-mono-tech text-[#66737E]">
              Already using AutoServe?{' '}
              <Link
                to="/login"
                className="text-[#F4512C] font-semibold underline underline-offset-4 hover:text-[#DC3F1E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C] rounded-xs"
              >
                Sign in
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Right "Service Pulse" Visual Column */}
          <motion.div
            initial={isReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: isReducedMotion ? 0 : 0.9, delay: isReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-6 w-full"
          >
            <ServicePulseVisual />
          </motion.div>
        </div>
      </Container>

      {/* Hero Bottom Scroll Indicator */}
      <div className="relative z-10 flex justify-center pt-8">
        <ScrollIndicator />
      </div>
    </section>
  );
};
