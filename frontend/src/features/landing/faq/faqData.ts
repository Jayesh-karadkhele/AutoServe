export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is AutoServe?',
    answer: 'AutoServe is a vehicle-service management platform designed to connect vehicle owners, service managers, mechanics, and administrators within a single transparent operational record encompassing appointments, job cards, repair evidence, itemized billing, and service history.',
    category: 'Platform Architecture',
  },
  {
    id: 'faq-2',
    question: 'How do I book a vehicle service?',
    answer: 'A customer account can add a vehicle to their reusable profile and submit an appointment request specifying the target vehicle, primary concerns, preferred date, and service requirements.',
    category: 'Booking & Scheduling',
  },
  {
    id: 'faq-3',
    question: 'Can I select Admin, Manager or Mechanic during registration?',
    answer: 'No. Public registration creates Customer accounts only. Staff accounts (Service Manager, Mechanic, Administrator) are provisioned exclusively through authorized administrative governance workflows.',
    category: 'Account Governance',
  },
  {
    id: 'faq-4',
    question: 'Who reviews and assigns my appointment?',
    answer: 'Authorized workshop management staff review incoming appointment requests, verify bay availability, and allocate an assigned mechanic according to role permissions.',
    category: 'Workshop Operations',
  },
  {
    id: 'faq-5',
    question: 'Can I follow the progress of a repair?',
    answer: 'AutoServe is designed to connect appointment status, job-card stage execution, and available repair evidence into your customer timeline so you can observe documented updates as work progresses.',
    category: 'Service Visibility',
  },
  {
    id: 'faq-6',
    question: 'What is repair evidence?',
    answer: 'Authorized workshop staff may attach diagnostic notes, measurements, images, or videos directly to the digital job card, giving customers visual context for documented repair stages.',
    category: 'Repair Evidence',
  },
  {
    id: 'faq-7',
    question: 'How is the invoice calculated?',
    answer: 'Invoices present an itemized breakdown of spare parts, labour hours, applicable promotional discounts, and GST (Goods and Services Tax in ₹) calculated using precise monetary representations.',
    category: 'Transparent Billing',
  },
  {
    id: 'faq-8',
    question: 'Does completing the payment screen automatically mark an invoice as paid?',
    answer: 'No. A payment gateway response signature must be verified securely by the backend before an invoice status is updated to Paid in the platform record.',
    category: 'Payment Verification',
  },
  {
    id: 'faq-9',
    question: 'Is Roadside Assistance currently live?',
    answer: 'The landing page presents a planned capability preview of the roadside assistance workflow. A complete live dispatch, GPS tracking, and towing-partner network has not yet been implemented or verified.',
    category: 'Planned Features',
  },
  {
    id: 'faq-10',
    question: 'Who can access my vehicle and service records?',
    answer: 'Access is controlled according to role and resource relationships. Customers access their own vehicle records, assigned workshop staff access relevant operational job cards, and administrators exercise controlled platform governance.',
    category: 'Role & Privacy Governance',
  },
];
