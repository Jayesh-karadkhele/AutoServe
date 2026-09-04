import React from 'react';
import { motion } from 'motion/react';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, CheckCircle2, Shield, Wrench, User, FileCheck, CreditCard } from 'lucide-react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const WorkOrderHandoff: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();

  const stages = [
    { label: 'Customer Books', role: 'Customer', icon: <User className="w-4 h-4 text-[#00A7B5]" />, desc: 'Vehicle & Symptom Logged' },
    { label: 'Manager Assigns', role: 'Manager', icon: <Shield className="w-4 h-4 text-[#00A7B5]" />, desc: 'Bay & Mechanic Allocated' },
    { label: 'Mechanic Repairs', role: 'Mechanic', icon: <Wrench className="w-4 h-4 text-[#F4512C]" />, desc: 'Parts Used & Photos Stamped' },
    { label: 'Manager Verifies', role: 'Manager', icon: <FileCheck className="w-4 h-4 text-[#178A68]" />, desc: 'Pricing Locked & Quality Approved' },
    { label: 'Customer Completes', role: 'Customer', icon: <CreditCard className="w-4 h-4 text-[#00A7B5]" />, desc: 'Razorpay Settled & History Saved' },
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-[#F7F5EF] via-[#FFFFFF] to-[#F7F5EF] border-y border-[#17212B]/08 overflow-hidden select-none">
      <Container size="xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="orange" className="mb-4">
            OPERATIONAL HANDOFF
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#17212B] tracking-tight mb-4">
            ONE WORK ORDER. SHARED CONTEXT.
          </h2>
          <p className="text-editorial-body text-[#66737E]">
            As a service moves through each role, the digital work order accumulates information without losing history—giving customers, managers, mechanics, and admins complete clarity.
          </p>
        </div>

        {/* Handoff Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {stages.map((st, idx) => (
            <motion.div
              key={st.label}
              initial={isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: isReducedMotion ? 0 : 0.5,
                delay: isReducedMotion ? 0 : idx * 0.12,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="bg-white border border-[#17212B]/10 rounded-2xl p-4 flex flex-col justify-between shadow-xs relative group hover:border-[#00A7B5]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono-tech">
                  <span className="text-[#00A7B5] font-bold">0{idx + 1}</span>
                  <span className="text-[10px] text-[#66737E] uppercase px-2 py-0.5 rounded bg-[#F2F7F8]">
                    {st.role}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-xl bg-[#EAF7FA] flex items-center justify-center mb-3">
                  {st.icon}
                </div>

                <h4 className="text-sm font-display font-semibold text-[#17212B] mb-1">
                  {st.label}
                </h4>

                <p className="text-[11px] font-mono-tech text-[#66737E] leading-tight">
                  {st.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#17212B]/06 flex items-center justify-between text-[10px] font-mono-tech text-[#178A68]">
                <span className="flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  ACCUMULATED
                </span>
                {idx < stages.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#66737E] hidden md:block" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Oversight Note */}
        <div className="mt-8 text-center">
          <span className="text-xs font-mono-tech text-[#66737E] bg-white border border-[#17212B]/10 px-4 py-2 rounded-full inline-block">
            🛡 ADMINISTRATOR OVERSIGHT LAYER: User Roles • System Logs • Platform Health • Global Inventory
          </span>
        </div>
      </Container>
    </div>
  );
};
