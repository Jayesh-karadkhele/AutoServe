export interface TrustPrinciple {
  id: string;
  title: string;
  copy: string;
  iconName: 'shield' | 'file-text' | 'calculator' | 'history';
  badge: string;
}

export const TRUST_PRINCIPLES: TrustPrinciple[] = [
  {
    id: 'controlled_access',
    title: 'Controlled Access',
    copy: 'Customers, managers, mechanics and administrators receive focused permissions for their responsibilities.',
    iconName: 'shield',
    badge: 'RBAC Enforcement',
  },
  {
    id: 'documented_work',
    title: 'Documented Work',
    copy: 'Job progress, service notes and repair evidence remain connected to the relevant service record.',
    iconName: 'file-text',
    badge: 'Evidence Vault',
  },
  {
    id: 'precise_billing',
    title: 'Precise Billing',
    copy: 'Parts, labour, discounts and tax are represented using precise monetary values.',
    iconName: 'calculator',
    badge: 'BigDecimal Accuracy',
  },
  {
    id: 'connected_history',
    title: 'Connected History',
    copy: 'Appointments, job cards, evidence and invoices contribute to a retained service record.',
    iconName: 'history',
    badge: 'Retained Vehicle History',
  },
];

export interface TraceStage {
  id: string;
  title: string;
  ref: string;
  details: string;
  addedContext: string;
}

export const TRACE_STAGES: TraceStage[] = [
  {
    id: 'appointment',
    title: 'Appointment',
    ref: 'AS-APT-260884',
    details: 'Customer selects vehicle & concern slot.',
    addedContext: 'Adds vehicle profile, reported concern, date, and customer contact reference.',
  },
  {
    id: 'job_card',
    title: 'Job Card',
    ref: 'AS-JC-260884',
    details: 'Manager assigns mechanic & bay.',
    addedContext: 'Adds assigned technician #3 Marcus Vance, workshop Bay 3, and diagnostic tasks.',
  },
  {
    id: 'evidence',
    title: 'Evidence',
    ref: 'AS-EVD-260884',
    details: 'Mechanic attaches before/after photos.',
    addedContext: 'Adds 22.8mm micrometer measurement scan photo and pad fitment verification photo.',
  },
  {
    id: 'invoice',
    title: 'Invoice',
    ref: 'AS-INV-260884',
    details: 'Parts, labor, GST in ₹ locked.',
    addedContext: 'Adds ₹12,450 subtotal + 18% GST (₹2,241) itemized invoice breakdown.',
  },
  {
    id: 'service_history',
    title: 'Service History',
    ref: 'AS-HIS-260884',
    details: 'Archived into retained vehicle record.',
    addedContext: 'Permanently links full service lifecycle into Taycan 4S retained service history.',
  },
];
