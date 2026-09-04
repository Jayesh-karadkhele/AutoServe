export interface JourneyStep {
  id: string;
  num: string;
  title: string;
  roles: string[];
  customerAction: string;
  autoServeCoordination: string;
  outcome: string;
  previewTitle: string;
}

export class JourneyStepData {
  static readonly steps: JourneyStep[] = [
    {
      id: 'step-1',
      num: '01',
      title: 'Add your vehicle',
      roles: ['Customer'],
      customerAction: 'Records vehicle make, model, year, license plate, and past service notes.',
      autoServeCoordination: 'Creates a persistent digital vehicle profile saved in the customer account.',
      outcome: 'Vehicle ready for seamless single-click booking and roadside requests.',
      previewTitle: 'VEHICLE PROFILE MANAGEMENT',
    },
    {
      id: 'step-2',
      num: '02',
      title: 'Book the service',
      roles: ['Customer'],
      customerAction: 'Selects vehicle, preferred date, time slot, and describes service symptoms.',
      autoServeCoordination: 'Places appointment into workshop review queue with snapshot pricing reference.',
      outcome: 'Appointment locked with real-time status visible on customer dashboard.',
      previewTitle: 'APPOINTMENT SCHEDULING',
    },
    {
      id: 'step-3',
      num: '03',
      title: 'Review and assign',
      roles: ['Manager', 'Customer'],
      customerAction: 'Receives assignment notification & slot confirmation.',
      autoServeCoordination: 'Manager verifies slot availability, allocates bay, and assigns lead mechanic.',
      outcome: 'Mechanic assigned, bay allocated, customer status updated.',
      previewTitle: 'WORKSHOP BAY ASSIGNMENT',
    },
    {
      id: 'step-4',
      num: '04',
      title: 'Diagnose and repair',
      roles: ['Mechanic'],
      customerAction: 'Tracks live repair stage and mechanic diagnostic notes.',
      autoServeCoordination: 'Mechanic opens digital job card, logs diagnostic items and spare parts used.',
      outcome: 'Active work execution tied directly to job card record.',
      previewTitle: 'DIGITAL JOB CARD EXECUTION',
    },
    {
      id: 'step-5',
      num: '05',
      title: 'Verify the work',
      roles: ['Manager', 'Mechanic'],
      customerAction: 'Inspects uploaded before/after photo & video repair evidence.',
      autoServeCoordination: 'Manager reviews completed evidence, checks quality, and locks line item prices.',
      outcome: 'Work quality verified before invoice generation.',
      previewTitle: 'EVIDENCE VAULT VERIFICATION',
    },
    {
      id: 'step-6',
      num: '06',
      title: 'Invoice and pay',
      roles: ['Customer', 'Manager'],
      customerAction: 'Reviews itemized invoice (parts, labor, GST in ₹) and settles via Razorpay.',
      autoServeCoordination: 'Generates OpenPDF digital invoice and verifies HMAC SHA256 payment signature.',
      outcome: 'Payment settled, digital receipt stored in vehicle history.',
      previewTitle: 'SNAPSHOT INVOICING & PAYMENT',
    },
    {
      id: 'step-7',
      num: '07',
      title: 'Close with confidence',
      roles: ['Customer', 'Manager'],
      customerAction: 'Collects vehicle and submits rating & workshop feedback.',
      autoServeCoordination: 'Archives job card into vehicle’s permanent service record.',
      outcome: 'Complete transparent service record saved forever.',
      previewTitle: 'SERVICE COMPLETION & HISTORY',
    },
  ];
}
