export type RsaStageId = 'request' | 'location' | 'assistance_type' | 'dispatch_track' | 'resolution';

export interface RsaStageData {
  id: RsaStageId;
  stepNum: string;
  title: string;
  statusText: string;
  description: string;
  estimatedTime: string;
  actionHint: string;
}

export const RSA_STAGES: RsaStageData[] = [
  {
    id: 'request',
    stepNum: '01',
    title: 'Request Help',
    statusText: 'Request Initiated',
    description: 'Customer triggers roadside assistance from digital profile or vehicle card.',
    estimatedTime: 'Illustrative estimate: < 2 mins response',
    actionHint: 'Single-click emergency dispatch request from active profile.',
  },
  {
    id: 'location',
    stepNum: '02',
    title: 'Confirm Location',
    statusText: 'Location Verified',
    description: 'GPS coordinate snapshot and landmark note confirmed by customer.',
    estimatedTime: 'Illustrative estimate: Metro Hub Zone 4',
    actionHint: 'Landmark: Western Express Highway Exit 12.',
  },
  {
    id: 'assistance_type',
    stepNum: '03',
    title: 'Review Assistance Type',
    statusText: 'Service Requisitioned',
    description: 'Select requirement: Flat Tyre, Battery Jumpstart, Breakdown, or Towing.',
    estimatedTime: 'Illustrative estimate: Flat Tyre Assistance',
    actionHint: 'Assistance type determines dispatch unit equipment.',
  },
  {
    id: 'dispatch_track',
    stepNum: '04',
    title: 'Track Planned Dispatch',
    statusText: 'Dispatch En Route',
    description: 'Assistance unit dispatched from nearest Metro Hub Bay center.',
    estimatedTime: 'Illustrative estimate: 14 mins ETA',
    actionHint: 'Route preview displayed on abstract city grid map.',
  },
  {
    id: 'resolution',
    stepNum: '05',
    title: 'Confirm Resolution',
    statusText: 'Assistance Resolved',
    description: 'Work completed on site or vehicle towed safely to workshop bay.',
    estimatedTime: 'Illustrative estimate: Resolved & Archived',
    actionHint: 'Resolution note saved into retained vehicle history.',
  },
];
