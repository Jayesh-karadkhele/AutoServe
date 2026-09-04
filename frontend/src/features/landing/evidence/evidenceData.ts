export type EvidenceStageId = 'reported' | 'diagnosed' | 'in_progress' | 'verified';

export interface EvidenceStageData {
  id: EvidenceStageId;
  label: string;
  badge: string;
  timestamp: string;
  technicianNote: string;
  managerReview: string;
  customerExplanation: string;
  beforeLabel: string;
  afterLabel: string;
  stageStatus: string;
}

export const JOB_CARD_REF = 'AS-JC-260884';
export const INVOICE_REF = 'AS-INV-260884';
export const VEHICLE_NAME = '2022 Porsche Taycan 4S';
export const VEHICLE_PLATE = 'MH 12 PA 8842';

export const EVIDENCE_STAGES: EvidenceStageData[] = [
  {
    id: 'reported',
    label: 'Reported',
    badge: 'Stage 01 • Customer Concern',
    timestamp: 'Today, 09:15 AM IST',
    technicianNote: 'Customer noted high-speed vibration and squeal during front axle deceleration.',
    managerReview: 'Request logged • Vehicle checked into Bay 3',
    customerExplanation: 'Initial concern logged into digital profile before workshop diagnosis begins.',
    beforeLabel: 'Reported symptom area (Front Brake Assembly)',
    afterLabel: 'Reference spec baseline',
    stageStatus: 'Logged & Checked In',
  },
  {
    id: 'diagnosed',
    label: 'Diagnosed',
    badge: 'Stage 02 • Technician Inspection',
    timestamp: 'Today, 10:30 AM IST',
    technicianNote: 'Micrometer scan shows front rotor wear at 22.8mm (minimum spec 24.0mm). Glazed ceramic pads requiring replacement.',
    managerReview: 'Diagnostic verified • OEM parts requisitioned',
    customerExplanation: 'Digital measurement photos attached directly to job card AS-JC-260884.',
    beforeLabel: 'Worn rotor surface (22.8mm micro-grooves)',
    afterLabel: 'Target OEM specification (24.0mm+)',
    stageStatus: 'Diagnosis Verified',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    badge: 'Stage 03 • Active Repair Execution',
    timestamp: 'Today, 01:45 PM IST',
    technicianNote: 'Old pad assembly unmounted. Caliper pistons cleaned, torque-bled with DOT 4 fluid, and new ceramic pad set fitted.',
    managerReview: 'Bay 3 work in progress • Requisition parts matched',
    customerExplanation: 'Active installation progress logged with photo evidence before reassembly.',
    beforeLabel: 'Disassembled caliper & worn pad set',
    afterLabel: 'New ceramic pad set fitted & torqued',
    stageStatus: 'Work in Execution',
  },
  {
    id: 'verified',
    label: 'Verified',
    badge: 'Stage 04 • Quality & Road Test',
    timestamp: 'Today, 03:20 PM IST',
    technicianNote: 'Dynamic road test completed (12 km). Zero vibration, pedal firmness verified at 120 bar pressure test.',
    managerReview: 'Final inspection passed • Invoice ready for customer review',
    customerExplanation: 'Completed evidence verified by Service Manager before invoice generation.',
    beforeLabel: 'Pre-service friction measurement',
    afterLabel: 'Post-service test pass report',
    stageStatus: 'Quality Verified',
  },
];
