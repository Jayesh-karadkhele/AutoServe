import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { ROLES_DATA, type RoleId } from './roleData';
import { RoleSelector } from './RoleSelector';
import { RoleWorkspacePreview } from './RoleWorkspacePreview';
import { motion } from 'motion/react';
import { useReducedMotionContext } from '@/motion/ReducedMotionContext';

export const RoleExperienceSection: React.FC = () => {
  const isReducedMotion = useReducedMotionContext();
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>('customer');

  const selectedRole = ROLES_DATA.find(r => r.id === selectedRoleId) || ROLES_DATA[0];

  return (
    <Section
      id="roles"
      aria-label="Platform Role Experience"
      className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-cyan-50/20 border-t border-slate-200/80 relative overflow-hidden"
    >
      {/* Background subtle detail grid lines */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
        aria-hidden="true"
      />

      <Container size="xl" className="relative z-10 space-y-10 sm:space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="cyan" className="mx-auto">
            Role-Based Workspace Experience
          </Badge>
          <h2 className="text-section-heading font-display font-bold text-[#17212B] tracking-tight">
            ONE PLATFORM. FOUR FOCUSED WORKSPACES.
          </h2>
          <p className="text-editorial-body text-[#66737E]">
            Every role sees the information and actions needed for its part of the service journey—without losing the shared operational context.
          </p>
        </div>

        {/* Accessible Role Selector Tabs */}
        <div className="flex justify-center">
          <RoleSelector
            roles={ROLES_DATA}
            selectedRoleId={selectedRoleId}
            onSelectRole={setSelectedRoleId}
          />
        </div>

        {/* Active Role Panel */}
        <motion.div
          key={selectedRoleId}
          initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <RoleWorkspacePreview role={selectedRole} />
        </motion.div>
      </Container>
    </Section>
  );
};
