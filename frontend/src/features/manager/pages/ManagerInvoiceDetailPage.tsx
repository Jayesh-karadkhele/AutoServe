import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ManagerShell } from '../components/ManagerShell';
import { getInvoiceById } from '../api/managerApi';
import type { ManagerInvoice } from '../types/managerTypes';
import { apiClient } from '@/lib/api/apiClient';
import { Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ManagerInvoiceDetailPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const id = parseInt(invoiceId || '0', 10);

  const [invoice, setInvoice] = useState<ManagerInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInvoiceById(id);
      setInvoice(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load invoice details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const response = await apiClient.get(`/api/invoices/${id}/download`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoice?.invoiceNumber || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to download invoice PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ManagerShell
      pageTitle={`Invoice #${invoice?.invoiceNumber || id}`}
      breadcrumbs={[
        { label: 'Invoices', href: '/manager/invoices' },
        { label: `Invoice #${invoice?.invoiceNumber || id}` },
      ]}
    >
      {error && (
        <div role="alert" className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-sm text-[#B91C1C] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-sm text-[#6B7280] animate-pulse bg-white rounded-2xl border border-[#E5E7EB]">
          Loading invoice breakdown...
        </div>
      ) : !invoice ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <h3 className="text-base font-bold text-[#111827]">Invoice Not Found</h3>
          <p className="text-xs text-[#6B7280]">The requested invoice does not exist or is outside your manager scope.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Bar */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-[#111827]">Invoice {invoice.invoiceNumber}</h2>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs ${
                    invoice.paymentStatus === 'PAID'
                      ? 'bg-[#ECFDF5] text-[#059669]'
                      : invoice.paymentStatus === 'PENDING'
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#FEF2F2] text-[#DC2626]'
                  }`}
                >
                  {invoice.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Job Card: <strong className="text-[#111827]">JC#{invoice.jobCardId}</strong>
              </p>
            </div>

            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadPdf}
              className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-sm transition-colors shadow-md min-h-[44px] flex items-center gap-2"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Download Official PDF</span>
            </button>
          </div>

          {/* Itemized Calculation Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-[#E5E7EB] pb-6 text-xs">
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Billed To Customer</span>
                <p className="font-extrabold text-[#111827] text-sm mt-1">{invoice.customerName || 'Customer'}</p>
                <p className="text-[#6B7280]">{invoice.customerPhone || 'N/A'}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Vehicle Details</span>
                <p className="font-bold text-[#111827] mt-1">{invoice.vehicleDetails || 'Vehicle'}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563]">Base Parts Amount:</span>
                <span className="font-mono font-bold text-[#111827]">
                  {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoice.baseAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563]">Labor Charges:</span>
                <span className="font-mono font-bold text-[#111827]">
                  {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoice.laborCost || 0)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563]">GST Tax ({invoice.taxPercentage || 18}%):</span>
                <span className="font-mono font-bold text-[#111827]">
                  {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoice.taxAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between py-4 border-t-2 border-[#111827] text-base">
                <span className="font-extrabold text-[#111827]">Final Payable Amount:</span>
                <span className="font-mono font-black text-[#059669]">
                  {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(invoice.totalAmount || 0)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#6B7280] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              <span>
                Payment status is managed via secure customer checkout and Razorpay webhooks. Managers cannot manually alter payment status.
              </span>
            </div>
          </div>
        </div>
      )}
    </ManagerShell>
  );
};
