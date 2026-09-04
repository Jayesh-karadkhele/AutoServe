export interface InvoiceLineItem {
  id: string;
  category: 'part' | 'labour' | 'tax' | 'discount';
  name: string;
  spec: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  explanation: string;
  stageOrigin: string;
}

export const INVOICE_REF = 'AS-INV-260884';
export const JOB_CARD_REF = 'AS-JC-260884';
export const VEHICLE_NAME = '2022 Porsche Taycan 4S';

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const INVOICE_LINE_ITEMS: InvoiceLineItem[] = [
  {
    id: 'line-1',
    category: 'part',
    name: 'Front Ceramic Brake Pad Set (OEM)',
    spec: 'Part #BP-8842 • Porsche Taycan Spec',
    qty: 1,
    unitPrice: 8500,
    totalPrice: 8500,
    explanation: 'Original OEM front axle ceramic pad set. Glaze-resistant ceramic compound rated for high deceleration.',
    stageOrigin: 'Requisitioned & Reserved during Bay 3 Diagnosis',
  },
  {
    id: 'line-2',
    category: 'part',
    name: 'DOT 4 High-Temp Brake Fluid (1L)',
    spec: 'Part #FL-9021 • High Boiling Point',
    qty: 2,
    unitPrice: 750,
    totalPrice: 1500,
    explanation: 'Low-viscosity high boiling point synthetic brake fluid for electronic stability & ABS pressure bleeding.',
    stageOrigin: 'Logged during Requisition',
  },
  {
    id: 'line-3',
    category: 'labour',
    name: 'Front Axle Brake Service & Pressure Bleed',
    spec: '2.5 Technical Hours • Specialist Rate',
    qty: 2.5,
    unitPrice: 1200,
    totalPrice: 3000,
    explanation: 'Standard labor charges for caliper disassembly, piston cleaning, pad fitment, torque calibration, and road test.',
    stageOrigin: 'Logged by Tech #3 Marcus Vance',
  },
  {
    id: 'line-4',
    category: 'discount',
    name: 'First Service Digital Portal Discount',
    spec: 'Promo #WELCOME-AS',
    qty: 1,
    unitPrice: -550,
    totalPrice: -550,
    explanation: 'Applies introductory discount for online scheduling via AutoServe customer portal.',
    stageOrigin: 'Applied during Booking',
  },
];

export const INVOICE_SUBTOTAL = 12450;
export const INVOICE_GST_RATE = 0.18; // 18% GST
export const INVOICE_GST_AMOUNT = Math.round(INVOICE_SUBTOTAL * INVOICE_GST_RATE); // ₹2,241.00
export const INVOICE_FINAL_TOTAL = INVOICE_SUBTOTAL + INVOICE_GST_AMOUNT; // ₹14,691.00
