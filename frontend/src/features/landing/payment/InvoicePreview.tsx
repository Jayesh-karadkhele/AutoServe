import React, { useState } from 'react';
import {
  INVOICE_REF,
  JOB_CARD_REF,
  VEHICLE_NAME,
  INVOICE_LINE_ITEMS,
  INVOICE_SUBTOTAL,
  INVOICE_GST_AMOUNT,
  INVOICE_FINAL_TOTAL,
  formatINR,
} from './invoiceData';
import { InvoiceLineExplainer } from './InvoiceLineExplainer';
import { FileText, Eye } from 'lucide-react';

export const InvoicePreview: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-100/60 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 text-white">
              {INVOICE_REF}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Illustrative invoice
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Itemized Service Statement — {VEHICLE_NAME}
          </h4>
          <p className="text-xs text-slate-500 font-mono">
            Job Card: {JOB_CARD_REF} • Issued: Today, 03:30 PM IST
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            {isPreviewOpen ? 'Hide Full Invoice' : 'Preview invoice'}
          </button>
        </div>
      </div>

      {/* Itemized Line Items List */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase text-slate-400 px-3 pb-1 border-b border-slate-100">
          <span>Line Item & Description (Click line to explain cost)</span>
          <span>Amount (₹ INR)</span>
        </div>

        <div className="divide-y divide-slate-100">
          {INVOICE_LINE_ITEMS.map((item) => (
            <InvoiceLineExplainer key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Financial Summary Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs font-mono">
        <div className="flex justify-between text-slate-600">
          <span>Parts & Labour Subtotal</span>
          <span>{formatINR(INVOICE_SUBTOTAL)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Goods & Services Tax (GST 18%)</span>
          <span>{formatINR(INVOICE_GST_AMOUNT)}</span>
        </div>
        <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
          <span className="font-display">Total Amount Payable</span>
          <span className="text-cyan-700 text-base">{formatINR(INVOICE_FINAL_TOTAL)}</span>
        </div>
      </div>

      {/* Invoice Full Overlay Preview Modal */}
      {isPreviewOpen && (
        <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-200 text-xs space-y-3">
          <div className="flex items-center justify-between text-cyan-900 font-semibold">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-600" />
              Full Digital Invoice Document View ({INVOICE_REF})
            </span>
            <span className="font-mono text-[10px] text-cyan-700">OpenPDF Engine Render</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            This is an in-browser illustrative snapshot preview of the generated digital invoice for {VEHICLE_NAME} under job card {JOB_CARD_REF}.
          </p>
          <div className="p-3 bg-white rounded border border-cyan-200 font-mono text-[11px] text-slate-700 space-y-1">
            <p>Billed to: David Ross • Account #CUST-9821</p>
            <p>Service Center: Metro Hub Workshop Bay 3</p>
            <p>HMAC SHA256 Invoice Verification Hash: <span className="text-slate-400">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></p>
          </div>
        </div>
      )}
    </div>
  );
};
