import React, { useState } from 'react';
import { INVOICE_FINAL_TOTAL, formatINR } from './invoiceData';
import { ArrowRight, Lock, AlertCircle } from 'lucide-react';

export type PaymentState = 'created' | 'provider_opened' | 'verification_pending' | 'paid_preview';

export const PaymentStatusPath: React.FC = () => {
  // Must initially display 'created' or 'verification_pending'. NEVER default to 'paid_preview'!
  const [paymentState, setPaymentState] = useState<PaymentState>('created');

  const steps = [
    { num: '01', title: 'Review Invoice', desc: 'Inspect itemized parts & labor breakdown' },
    { num: '02', title: 'Confirm Amount', desc: `Verify final payable amount ${formatINR(INVOICE_FINAL_TOTAL)}` },
    { num: '03', title: 'Continue to Provider', desc: 'Forward request to configured payment gateway' },
    { num: '04', title: 'Receive Result', desc: 'Obtain encrypted payment signature & status' },
    { num: '05', title: 'Retain Record', desc: 'Store digital receipt in vehicle service history' },
  ];

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-100/60 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900">
            Payment Journey & Security Status Path
          </h4>
          <p className="text-xs text-slate-500">
            5-stage client-to-backend transactional payment lifecycle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-amber-600" />
            Razorpay Configured Provider
          </span>
        </div>
      </div>

      {/* 5 Sequence Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {steps.map((step, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-600">STEP {step.num}</span>
            <p className="text-xs font-bold text-slate-900">{step.title}</p>
            <p className="text-[11px] text-slate-500 leading-tight">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Status Sequence Indicator Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-semibold text-slate-900">Interactive Status Sequence State:</span>
          <span className="text-slate-500">Click states to test preview transition</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPaymentState('created')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer min-h-[44px] ${
              paymentState === 'created'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            1. Created (Default)
          </button>

          <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />

          <button
            type="button"
            onClick={() => setPaymentState('provider_opened')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer min-h-[44px] ${
              paymentState === 'provider_opened'
                ? 'bg-cyan-600 text-white border-cyan-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            2. Provider Opened
          </button>

          <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />

          <button
            type="button"
            onClick={() => setPaymentState('verification_pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer min-h-[44px] ${
              paymentState === 'verification_pending'
                ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            3. Verification Pending
          </button>

          <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />

          <button
            type="button"
            onClick={() => setPaymentState('paid_preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer min-h-[44px] ${
              paymentState === 'paid_preview'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            4. Paid (Illustrative State)
          </button>
        </div>

        {/* State Detail Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
          {paymentState === 'created' && (
            <p>Current Status: <span className="font-bold text-slate-900">CREATED</span> — Invoice AS-INV-260884 generated. Ready for payment initialization.</p>
          )}
          {paymentState === 'provider_opened' && (
            <p>Current Status: <span className="font-bold text-cyan-700">PROVIDER OPENED</span> — Razorpay payment modal opened with order reference AS-ORD-260884.</p>
          )}
          {paymentState === 'verification_pending' && (
            <p>Current Status: <span className="font-bold text-amber-700">VERIFICATION PENDING</span> — Customer payment completed; HMAC signature awaiting backend verification.</p>
          )}
          {paymentState === 'paid_preview' && (
            <p>Current Status: <span className="font-bold text-emerald-700">PAID (ILLUSTRATIVE PREVIEW)</span> — Backend verified signature. Receipt archived into service record.</p>
          )}
        </div>
      </div>

      {/* Strict Mandatory Disclaimer Box */}
      <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-950">Payment Interaction Disclaimer:</p>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            Payment interaction preview — no transaction will be created. The backend must verify the payment result signature before an invoice becomes marked as paid in the connected platform record.
          </p>
        </div>
      </div>
    </div>
  );
};
