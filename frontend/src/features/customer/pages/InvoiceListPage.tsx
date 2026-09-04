import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerShell } from '../components/CustomerShell';
import { useCustomerInvoices } from '../hooks/useCustomerInvoices';
import { FileText, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

export const InvoiceListPage: React.FC = () => {
  const { invoices, isLoading, error, refetch } = useCustomerInvoices();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredInvoices = invoices.filter((i) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'PENDING') return i.paymentStatus === 'PENDING';
    if (filterStatus === 'PAID') return i.paymentStatus === 'PAID';
    if (filterStatus === 'FAILED') return i.paymentStatus === 'FAILED';
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      case 'PENDING':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
      case 'FAILED':
        return 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]';
      default:
        return 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';
    }
  };

  return (
    <CustomerShell
      pageTitle="Invoices & Payments"
      breadcrumbs={[{ label: 'Invoices' }]}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
          {[
            { label: 'All Invoices', value: 'ALL' },
            { label: 'Pending Payment', value: 'PENDING' },
            { label: 'Paid', value: 'PAID' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                filterStatus === tab.value
                  ? 'bg-[#EA580C] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse" data-testid="invoice-loading-skeleton">
          <div className="h-24 bg-[#E5E7EB] rounded-2xl" />
          <div className="h-24 bg-[#E5E7EB] rounded-2xl" />
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[#B91C1C]">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="px-4 py-2 bg-[#DC2626] text-white rounded-xl font-semibold text-sm hover:bg-[#B91C1C] flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {!isLoading && !error && filteredInvoices.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-[#FFF7ED] text-[#EA580C] rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#111827]">No Invoices Found</h2>
          <p className="text-sm text-[#6B7280]">
            There are no service invoices associated with your account matching the current filter.
          </p>
        </div>
      )}

      {!isLoading && !error && filteredInvoices.length > 0 && (
        <div className="space-y-4">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#111827]">
                    Invoice #{inv.invoiceNumber}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-3 py-0.5 rounded-full border ${getStatusBadge(
                      inv.paymentStatus
                    )}`}
                  >
                    {inv.paymentStatus}
                  </span>
                </div>

                <div className="text-xl font-extrabold text-[#111827]">
                  {formatCurrency(inv.totalAmount)}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280]">
                  {inv.vehicleDetails && <span>Vehicle: {inv.vehicleDetails}</span>}
                  {inv.issueDate && <span>Issued: {new Date(inv.issueDate).toLocaleDateString()}</span>}
                </div>
              </div>

              <div className="pt-3 md:pt-0 border-t md:border-t-0 border-[#F3F4F6]">
                <Link
                  to={`/customer/invoices/${inv.id}`}
                  className="px-4 py-2.5 bg-[#EA580C] hover:bg-[#D97706] text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1 min-h-[38px]"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerShell>
  );
};
