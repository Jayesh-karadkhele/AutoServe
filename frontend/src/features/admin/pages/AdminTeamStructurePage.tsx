import React, { useState } from 'react';
import { AdminShell } from '../components/AdminShell';
import { useAdminUsers } from '../hooks/useAdminData';
import type { UserSummary } from '../types/adminTypes';
import { ReassignMechanicModal } from '../components/ReassignMechanicModal';

export const AdminTeamStructurePage: React.FC = () => {
  const { users: managers, loading: mgrLoading } = useAdminUsers('MANAGER');
  const { users: mechanics, loading: techLoading, refresh } = useAdminUsers('MECHANIC');
  const [selectedMechanic, setSelectedMechanic] = useState<UserSummary | null>(null);
  const [reassignOpen, setReassignOpen] = useState(false);

  const handleOpenReassign = (mechanic: UserSummary) => {
    setSelectedMechanic(mechanic);
    setReassignOpen(true);
  };

  return (
    <AdminShell title="Team Structure & Workshop Capacity">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Manager–Mechanic Hierarchy Workspace</h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign or transfer technicians across workshop managers. Active job cards remain with the original manager until completion.
          </p>
        </div>

        {mgrLoading || techLoading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading team structure...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managers.map((mgr) => {
              const teamTechs = mechanics.filter((m) => m.managerId === mgr.id);
              return (
                <div key={mgr.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{mgr.fullName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase">
                          Manager
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{mgr.email} • Mobile: {mgr.mobile || 'N/A'}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                      {teamTechs.length} Techs
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assigned Mechanics</span>
                    {teamTechs.length === 0 ? (
                      <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-400 text-center">
                        No mechanics assigned to this manager.
                      </div>
                    ) : (
                      teamTechs.map((tech) => (
                        <div key={tech.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800 text-xs">{tech.fullName}</span>
                            <span className="text-xs text-slate-400 block">{tech.email}</span>
                          </div>
                          <button
                            onClick={() => handleOpenReassign(tech)}
                            className="px-3 py-1 bg-white border border-slate-200 hover:border-violet-300 text-violet-700 font-semibold text-xs rounded-lg shadow-2xs"
                          >
                            Transfer Team
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReassignMechanicModal
        isOpen={reassignOpen}
        onClose={() => setReassignOpen(false)}
        mechanic={selectedMechanic}
        managers={managers}
        onSuccess={() => refresh()}
      />
    </AdminShell>
  );
};
