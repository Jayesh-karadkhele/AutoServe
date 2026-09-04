import React from 'react';
import { Receipt, ShieldCheck } from 'lucide-react';
import { ProductWindow } from './ProductWindow';

export const InvoicePreview: React.FC = () => {
  return (
    <ProductWindow title="AUTOSERVE WORKFLOW • DIGITAL INVOICE & PAYMENTS" badgeText="PREVIEW • STEP 05" badgeVariant="success">
      <div className="space-y-3 text-xs font-mono-tech">
        <div className="p-3 bg-[#F2F7F8] rounded-xl border border-[#17212B]/08 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#178A68]" />
            <span className="font-semibold text-[#17212B]">INVOICE #INV-2026-089</span>
          </div>
          <span className="text-[10px] text-[#178A68] font-bold bg-[#178A68]/10 px-2 py-0.5 rounded">ITEMIZED</span>
        </div>

        {/* Itemized Line Items Table */}
        <div className="bg-white border border-[#17212B]/10 rounded-xl overflow-hidden divide-y divide-[#17212B]/06">
          <div className="p-2.5 bg-[#F7F5EF] flex justify-between font-bold text-[#17212B] text-[11px]">
            <span>ITEM & DESCRIPTION</span>
            <span>AMOUNT</span>
          </div>

          <div className="p-2.5 flex justify-between">
            <div>
              <div className="font-medium text-[#17212B]">Brake Pad Set (OEM)</div>
              <div className="text-[10px] text-[#66737E]">Qty: 1 • Unit: ₹ 2,200.00</div>
            </div>
            <span className="font-semibold text-[#17212B]">₹ 2,200.00</span>
          </div>

          <div className="p-2.5 flex justify-between">
            <div>
              <div className="font-medium text-[#17212B]">Labour Charge (Brake Replacement)</div>
              <div className="text-[10px] text-[#66737E]">1.5 Hours • Tech Bay #03</div>
            </div>
            <span className="font-semibold text-[#17212B]">₹ 1,500.00</span>
          </div>

          <div className="p-2.5 flex justify-between text-[#66737E]">
            <span>GST Tax (18%)</span>
            <span>₹ 666.00</span>
          </div>

          <div className="p-3 bg-[#EAF7FA] flex justify-between font-bold text-[#17212B] text-sm">
            <span>FINAL TOTAL</span>
            <span className="text-[#F4512C]">₹ 4,366.00</span>
          </div>
        </div>

        <div className="p-2 bg-[#F2F7F8] rounded-lg border border-[#17212B]/08 text-[10px] text-[#66737E] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#178A68]" />
            Snapshot pricing locked at booking
          </span>
          <span className="text-[#00A7B5] font-semibold">RAZORPAY VERIFIED</span>
        </div>
      </div>
    </ProductWindow>
  );
};
