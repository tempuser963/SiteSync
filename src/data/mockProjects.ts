import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'OILFIELD EXPANSION',
    location: 'Onshore Processing Facility, Block 7',
    status: 'Active',
    overallProgress: 68.4,
    scheduleStatus: 'On Track with Exceptions',
    lastUpdated: '2026-09-22T17:42:00',
    totalActivities: 1250,
    aiMatched: 1087,
    pendingReview: 104,
    unmatched: 59,
    contradictions: 7,
  },
  {
    id: 'PRJ-002',
    name: 'GAS PROCESSING UNIT',
    location: 'Offshore Platform Delta-4',
    status: 'Active',
    overallProgress: 42.1,
    scheduleStatus: 'Behind Schedule',
    lastUpdated: '2026-09-22T16:30:00',
    totalActivities: 890,
    aiMatched: 701,
    pendingReview: 89,
    unmatched: 100,
    contradictions: 12,
  },
  {
    id: 'PRJ-003',
    name: 'PIPELINE DEVELOPMENT',
    location: 'Pipeline Corridor Alpha-Bravo',
    status: 'Active',
    overallProgress: 81.7,
    scheduleStatus: 'Ahead of Schedule',
    lastUpdated: '2026-09-22T18:15:00',
    totalActivities: 680,
    aiMatched: 623,
    pendingReview: 32,
    unmatched: 25,
    contradictions: 3,
  },
];

export const defaultProjectId = 'PRJ-001';
