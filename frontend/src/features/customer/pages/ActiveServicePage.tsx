import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { useCustomerJobCards } from '../hooks/useCustomerJobCards';
import { getJobCardById } from '../api/customerApi';
import type { JobCard } from '../types/customerTypes';
import { EvidenceGalleryDialog } from '../components/EvidenceGalleryDialog';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Camera,
  User,
  Image as ImageIcon,
} from 'lucide-react';

export const ActiveServicePage: React.FC = () => {
  const { jobCardId } = useParams<{ jobCardId: string }>();
  const { jobCards, isLoading: loadingAll, error: errorAll, refetch } = useCustomerJobCards();

  const [selectedJobCard, setSelectedJobCard] = useState<JobCard | null>(null);
  const [isLoadingSingle, setIsLoadingSingle] = useState<boolean>(false);
  const [singleError, setSingleError] = useState<string | null>(null);

  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [selectedEvidenceIndex, setSelectedEvidenceIndex] = useState<number>(0);

  const numericId = jobCardId && jobCardId !== 'active' ? parseInt(jobCardId, 10) : null;

  useEffect(() => {
    if (numericId && !isNaN(numericId)) {
      const controller = new AbortController();
      setIsLoadingSingle(true);
      setSingleError(null);

      getJobCardById(numericId, controller.signal)
        .then((data) => setSelectedJobCard(data))
        .catch((err) => {
          if (err.name === 'CanceledError' || err.name === 'AbortError') return;
          setSingleError(
            err.response?.status === 403 || err.response?.status === 404
              ? 'Job card record not found or access restricted.'
              : err.response?.data?.message || err.message || 'Failed to load service tracking details.'
          );
        })
        .finally(() => setIsLoadingSingle(false));

      return () => controller.abort();
    } else if (jobCards.length > 0) {
      // Default to active or latest job card
      const active = jobCards.find((j) => j.status === 'IN_PROGRESS' || j.status === 'CREATED') || jobCards[0];
      setSelectedJobCard(active);
    }
  }, [numericId, jobCards]);

  const currentJobCard = numericId && !isNaN(numericId)
    ? selectedJobCard
    : (selectedJobCard || jobCards.find((j) => j.status === 'IN_PROGRESS' || j.status === 'CREATED') || jobCards[0] || null);

  const isLoading = loadingAll || isLoadingSingle;

  // Define 8 tracking timeline stages
  const timelineStages = [
    { key: 'REQUESTED', label: 'Appointment Requested', desc: 'Customer service request submitted' },
    { key: 'REVIEWED', label: 'Manager Reviewed', desc: 'Workshop manager accepted request' },
    { key: 'ASSIGNED', label: 'Mechanic Assigned', desc: 'Certified technician allocated to vehicle' },
    { key: 'IN_PROGRESS', label: 'Work Started', desc: 'Repair & inspection currently underway' },
    { key: 'EVIDENCE', label: 'Evidence Added', desc: 'Photo proof uploaded to service record' },
    { key: 'COMPLETED', label: 'Work Completed', desc: 'All repairs finished & quality checked' },
    { key: 'INVOICED', label: 'Invoice Created', desc: 'Final bill generated for review' },
    { key: 'CLOSED', label: 'Closed & Delivered', desc: 'Vehicle handed back to customer' },
  ];

  const getStageStatus = (stageKey: string, currentStatus?: string, evidenceCount: number = 0) => {
    if (!currentStatus) return 'future';

    if (currentStatus === 'CREATED') {
      if (['REQUESTED', 'REVIEWED', 'ASSIGNED'].includes(stageKey)) return 'completed';
      return 'future';
    }

    if (currentStatus === 'IN_PROGRESS') {
      if (['REQUESTED', 'REVIEWED', 'ASSIGNED'].includes(stageKey)) return 'completed';
      if (stageKey === 'IN_PROGRESS') return 'current';
      if (stageKey === 'EVIDENCE') return evidenceCount > 0 ? 'completed' : 'current';
      return 'future';
    }

    if (currentStatus === 'COMPLETED') {
      if (['REQUESTED', 'REVIEWED', 'ASSIGNED', 'IN_PROGRESS', 'EVIDENCE', 'COMPLETED'].includes(stageKey))
        return 'completed';
      return 'future';
    }

    if (currentStatus === 'CLOSED') return 'completed';

    return 'future';
  };

  const handleOpenGallery = (index: number) => {
    setSelectedEvidenceIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <CustomerShell
      pageTitle="Active Service Tracking"
      breadcrumbs={[
        { label: 'Service Tracking' },
        { label: selectedJobCard ? `Job #${selectedJobCard.jobCardNumber || selectedJobCard.id}` : 'Live Tracker' },
      ]}
    >
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7]">
            Latest recorded status
          </span>
          <p className="text-xs text-[#6B7280] mt-1">
            Real-time status updates recorded by workshop mechanics and managers.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] font-bold rounded-xl text-sm shadow-xs transition-colors min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4 text-[#EA580C]" /> Refresh Status
        </button>
      </div>

      {isLoading && (
        <div className="space-y-6 animate-pulse" data-testid="service-tracker-skeleton">
          <div className="h-40 bg-[#E5E7EB] rounded-2xl" />
          <div className="h-64 bg-[#E5E7EB] rounded-2xl" />
        </div>
      )}

      {!isLoading && (errorAll || singleError) && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[#B91C1C]">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">{singleError || errorAll}</p>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="px-4 py-2 bg-[#DC2626] text-white rounded-xl font-semibold text-sm hover:bg-[#B91C1C]"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !currentJobCard && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center mx-auto">
            <Wrench className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#111827]">No Active Service</h2>
          <p className="text-sm text-[#6B7280]">
            There are currently no active workshop service records for your vehicles.
          </p>
          <Link
            to="/customer/appointments/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EA580C] text-white font-bold rounded-xl text-sm min-h-[44px]"
          >
            Book New Service
          </Link>
        </div>
      )}

      {!isLoading && currentJobCard && (
        <div className="space-y-8">
          {/* Active Job Card Summary Header */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669]">
                  Status: {currentJobCard.status}
                </span>
                {currentJobCard.vehicleRegistration && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#E0F2FE] text-[#0284C7]">
                    {currentJobCard.vehicleRegistration}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-[#111827] mt-2">
                Job #{currentJobCard.jobCardNumber || currentJobCard.id}
              </h2>
              <p className="text-sm text-[#4B5563] mt-1">
                Reported Issue: <span className="font-semibold">{currentJobCard.reportedIssues || 'Regular Service'}</span>
              </p>
            </div>

            {currentJobCard.mechanicName && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl text-xs space-y-1">
                <span className="text-[#6B7280] block">Assigned Technician</span>
                <p className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#EA580C]" /> {currentJobCard.mechanicName}
                </p>
              </div>
            )}
          </div>

          {/* Timeline Tracker Component */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#EA580C]" /> Service Progress Timeline
            </h3>

            <div className="relative pl-6 space-y-6 border-l-2 border-[#E5E7EB]">
              {timelineStages.map((stage) => {
                const status = getStageStatus(
                  stage.key,
                  currentJobCard.status,
                  currentJobCard.evidenceList?.length || 0
                );

                return (
                  <div key={stage.key} className="relative flex items-start gap-4">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        status === 'completed'
                          ? 'bg-[#059669] border-[#059669] text-white'
                          : status === 'current'
                          ? 'bg-[#EA580C] border-[#EA580C] text-white animate-pulse'
                          : 'bg-white border-[#D1D5DB] text-[#9CA3AF]'
                      }`}
                    >
                      {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : ''}
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          status === 'completed'
                            ? 'text-[#059669]'
                            : status === 'current'
                            ? 'text-[#EA580C]'
                            : 'text-[#9CA3AF]'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Repair Evidence Gallery Section */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#EA580C]" /> Repair Evidence Photo Gallery
              </h3>
              <span className="text-xs font-bold text-[#6B7280]">
                {currentJobCard.evidenceList?.length || 0} Photos Uploaded
              </span>
            </div>

            {!currentJobCard.evidenceList || currentJobCard.evidenceList.length === 0 ? (
              <div className="p-8 text-center bg-[#F9FAFB] rounded-2xl border border-dashed border-[#D1D5DB] space-y-2">
                <ImageIcon className="w-10 h-10 text-[#9CA3AF] mx-auto stroke-1" />
                <p className="text-sm font-semibold text-[#4B5563]">No repair evidence uploaded yet</p>
                <p className="text-xs text-[#9CA3AF]">
                  Mechanics will upload photo proof during active disassembly and parts replacement.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentJobCard.evidenceList.map((ev, idx) => (
                  <button
                    key={ev.id || idx}
                    type="button"
                    onClick={() => handleOpenGallery(idx)}
                    className="group relative rounded-xl overflow-hidden border border-[#E5E7EB] bg-black aspect-video hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    aria-label={`View evidence photo ${idx + 1}: ${ev.caption || 'Repair photo'}`}
                  >
                    <img
                      src={ev.imageUrl}
                      alt={ev.caption || 'Repair evidence photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[11px] text-white font-medium truncate">
                        {ev.caption || `Photo ${idx + 1}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full-size Evidence Dialog */}
      {currentJobCard?.evidenceList && (
        <EvidenceGalleryDialog
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          evidenceList={currentJobCard.evidenceList}
          initialIndex={selectedEvidenceIndex}
        />
      )}
    </CustomerShell>
  );
};
