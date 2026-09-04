import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { JobCardEvidence } from '../types/customerTypes';

interface EvidenceGalleryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceList: JobCardEvidence[];
  initialIndex?: number;
}

export const EvidenceGalleryDialog: React.FC<EvidenceGalleryDialogProps> = ({
  isOpen,
  onClose,
  evidenceList,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageError, setImageError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setImageError(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeButtonRef.current?.focus(), 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => (prev + 1) % evidenceList.length);
          setImageError(false);
        } else if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => (prev - 1 + evidenceList.length) % evidenceList.length);
          setImageError(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose, evidenceList.length]);

  if (!isOpen || evidenceList.length === 0) return null;

  const currentItem = evidenceList[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <h2 id="evidence-modal-title" className="text-lg font-bold text-[#111827]">
            Repair Evidence Photo {currentIndex + 1} of {evidenceList.length}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close evidence photo viewer"
            className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center p-4 min-h-[300px] overflow-hidden">
          {imageError ? (
            <div className="flex flex-col items-center justify-center text-gray-400 py-12">
              <ImageIcon className="w-16 h-16 mb-2 stroke-1" />
              <p className="text-sm font-medium">Evidence image preview unavailable</p>
              <p className="text-xs text-gray-500 mt-1">Image path: {currentItem?.imageUrl}</p>
            </div>
          ) : (
            <img
              src={currentItem?.imageUrl}
              alt={currentItem?.caption || `Repair evidence stage ${currentItem?.stage || 'inspection'}`}
              onError={() => setImageError(true)}
              className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
            />
          )}

          {/* Previous Button */}
          {evidenceList.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((prev) => (prev - 1 + evidenceList.length) % evidenceList.length);
                setImageError(false);
              }}
              aria-label="Previous evidence photo"
              className="absolute left-4 p-3 bg-white/80 hover:bg-white text-[#111827] rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {evidenceList.length > 1 && (
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((prev) => (prev + 1) % evidenceList.length);
                setImageError(false);
              }}
              aria-label="Next evidence photo"
              className="absolute right-4 p-3 bg-white/80 hover:bg-white text-[#111827] rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#EA580C] min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Caption & Metadata Footer */}
        <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-sm font-semibold text-[#111827]">
              {currentItem?.caption || 'Vehicle Repair Stage Inspection'}
            </p>
            {currentItem?.stage && (
              <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                Stage: {currentItem.stage}
              </span>
            )}
          </div>
          {currentItem?.createdAt && (
            <span className="text-xs text-[#6B7280]">
              Uploaded: {new Date(currentItem.createdAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
