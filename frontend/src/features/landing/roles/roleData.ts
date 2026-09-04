export type RoleId = 'customer' | 'manager' | 'mechanic' | 'admin';

export interface RoleData {
  id: RoleId;
  name: string;
  subtitle: string;
  message: string;
  description: string;
  roleBadge: string;
  allowedActions: string[];
  restrictedAreas: string[];
}

export const ROLES_DATA: RoleData[] = [
  {
    id: 'customer',
    name: 'Customer',
    subtitle: 'Vehicle Care Portal',
    message: 'Everything about your vehicle care, without the follow-up calls.',
    description: 'Personal vehicle profile, active service timeline, repair evidence, and instant online payment.',
    roleBadge: 'Customer Workspace',
    allowedActions: [
      'Book appointment & request roadside assistance',
      'Inspect before/after photo & video repair evidence',
      'Review itemized invoices & pay via Razorpay',
    ],
    restrictedAreas: [
      'Cannot view other customers or private workshop data',
      'Cannot assign mechanic schedules or edit parts inventory',
    ],
  },
  {
    id: 'manager',
    name: 'Manager',
    subtitle: 'Workshop Operations Desk',
    message: 'Coordinate the workshop without losing the details.',
    description: 'Today’s appointment queue, bay assignment, mechanic availability, and invoice readiness.',
    roleBadge: 'Manager Workspace',
    allowedActions: [
      'Review incoming requests, assign mechanics & bays',
      'Verify uploaded repair evidence & lock snapshot prices',
      'Monitor inventory stock levels & invoice readiness',
    ],
    restrictedAreas: [
      'Cannot access another manager’s private team resources',
      'Cannot create administrator accounts',
    ],
  },
  {
    id: 'mechanic',
    name: 'Mechanic',
    subtitle: 'Technical Execution View',
    message: 'The next job, the right context and a clear finish line.',
    description: 'Assigned job cards, diagnostic checklists, requisitioned parts, and evidence upload vault.',
    roleBadge: 'Mechanic Workspace',
    allowedActions: [
      'View assigned job cards, vehicle info & customer concerns',
      'Log diagnostic notes & spare parts used during repair',
      'Upload before/after repair photos and videos to vault',
    ],
    restrictedAreas: [
      'Cannot view company-wide financial reports or staff accounts',
      'Cannot view jobs assigned to other mechanics',
    ],
  },
  {
    id: 'admin',
    name: 'Admin',
    subtitle: 'Platform Control Center',
    message: 'Platform-wide control with clearly separated responsibilities.',
    description: 'User governance, RBAC role enforcement, workshop-wide inventory and system health monitoring.',
    roleBadge: 'Admin Workspace',
    allowedActions: [
      'Create & manage staff accounts (Manager, Mechanic, Admin)',
      'Enforce RBAC role permissions & security rules',
      'Oversee workshop-wide appointments, inventory & invoices',
    ],
    restrictedAreas: [
      'All sample numbers are labeled as illustrative operational data',
      'Cannot alter locked transactional invoices or payment hashes',
    ],
  },
];
