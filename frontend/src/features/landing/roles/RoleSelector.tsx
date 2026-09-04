import React, { useRef } from 'react';
import type { RoleData } from './roleData';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  roles: RoleData[];
  selectedRoleId: string;
  onSelectRole: (id: RoleData['id']) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  roles,
  selectedRoleId,
  onSelectRole,
}) => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % roles.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + roles.length) % roles.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = roles.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    onSelectRole(roles[nextIndex].id);
    tabsRef.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Select Platform Role Workspace"
      className="flex items-center justify-center gap-2 p-1.5 bg-[#F2F7F8] border border-[#17212B]/10 rounded-2xl max-w-2xl mx-auto mb-10 overflow-x-auto select-none no-scrollbar"
    >
      {roles.map((role, idx) => {
        const isSelected = selectedRoleId === role.id;

        return (
          <button
            key={role.id}
            ref={(el) => { tabsRef.current[idx] = el; }}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`panel-${role.id}`}
            id={`tab-${role.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelectRole(role.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'px-5 py-3 rounded-xl text-xs font-mono-tech font-semibold transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 flex-1 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4512C]',
              isSelected
                ? 'bg-white text-[#17212B] shadow-sm border border-[#17212B]/10 font-bold'
                : 'text-[#66737E] hover:text-[#17212B] hover:bg-white/60'
            )}
          >
            <span>{role.name}</span>
            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#00A7B5]" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
};
