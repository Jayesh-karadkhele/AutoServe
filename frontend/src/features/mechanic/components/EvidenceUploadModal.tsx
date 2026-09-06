import React, { useState, useEffect } from 'react';
import { addEvidenceToJobCard } from '../api/mechanicApi';
import type { EvidenceCategory } from '../types/mechanicTypes';
import { X, UploadCloud, Camera, AlertCircle, Loader2, FileImage } from 'lucide-react';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobCardId: number;
  onSuccess: () => void;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  isOpen,
  onClose,
  jobCardId,
  onSuccess,
}) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceCategory>('DURING_REPAIR');
  const [originalFilename, setOriginalFilename] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSimulateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFilename(file.name);
      // Simulate photo URL or use object URL
      setPhotoUrl('https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhotoUrl = photoUrl.trim() || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80';
    if (!description.trim()) {
      setError('Please provide a mechanic note/description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addEvidenceToJobCard(jobCardId, {
        photoUrl: finalPhotoUrl,
        description: description.trim(),
        evidenceType,
        mediaType: 'image/jpeg',
        originalFilename: originalFilename || 'repair_evidence.jpg',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload repair evidence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 id="evidence-modal-title" className="text-base font-bold text-[#111827]">
                Upload Repair Evidence
              </h2>
              <p className="text-xs text-[#6B7280]">Record photo proof for Job Card #{jobCardId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close evidence modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div role="alert" className="p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#B91C1C] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Evidence Category */}
          <div className="space-y-1.5">
            <label htmlFor="evidence-type-select" className="block text-xs font-bold text-[#374151]">
              Evidence Stage Category <span className="text-[#DC2626]">*</span>
            </label>
            <select
              id="evidence-type-select"
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as EvidenceCategory)}
              className="w-full px-3 py-2.5 text-xs font-bold rounded-xl border border-[#D1D5DB] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
            >
              <option value="REPORTED">REPORTED (Customer Issue)</option>
              <option value="DIAGNOSIS">DIAGNOSIS (Inspection Findings)</option>
              <option value="BEFORE_REPAIR">BEFORE_REPAIR (Pre-Service Condition)</option>
              <option value="DURING_REPAIR">DURING_REPAIR (Work in Progress)</option>
              <option value="AFTER_REPAIR">AFTER_REPAIR (Post-Service Check)</option>
              <option value="COMPLETION">COMPLETION (Final Delivery Proof)</option>
            </select>
          </div>

          {/* File Picker / Drag & Drop Dropzone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#374151]">Select Photo Media</label>
            <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] rounded-2xl p-6 text-center space-y-2 bg-[#F8FAFC] transition-colors relative">
              <UploadCloud className="w-8 h-8 text-[#0284C7] mx-auto" />
              <p className="text-xs font-bold text-[#111827]">
                Click or drag & drop repair photo here
              </p>
              <p className="text-[11px] text-[#6B7280]">Supports JPEG, PNG up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleSimulateFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Upload photo file"
              />
            </div>
            {originalFilename && (
              <div className="flex items-center gap-2 p-2.5 bg-[#E0F2FE] rounded-xl text-xs font-bold text-[#0369A1]">
                <FileImage className="w-4 h-4" />
                <span>Selected: {originalFilename}</span>
              </div>
            )}
          </div>

          {/* Photo URL Direct Fallback */}
          <div className="space-y-1.5">
            <label htmlFor="photo-url-input" className="block text-xs font-bold text-[#374151]">
              Photo Media URL (Cloudinary / Storage Reference)
            </label>
            <input
              id="photo-url-input"
              type="text"
              placeholder="https://res.cloudinary.com/demo/image/upload/sample.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D1D5DB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
            />
          </div>

          {/* Description / Mechanic Note */}
          <div className="space-y-1.5">
            <label htmlFor="evidence-description" className="block text-xs font-bold text-[#374151]">
              Mechanic Note / Description <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              id="evidence-description"
              rows={3}
              placeholder="E.g., Measured front brake pad thickness at 3mm. Resurfaced rotors."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-[#D1D5DB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0284C7] min-h-[44px]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-bold text-[#4B5563] hover:bg-[#F3F4F6] min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-colors min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Evidence...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Save Evidence</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
