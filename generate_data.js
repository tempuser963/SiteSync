const fs = require('fs');

const mockReports = import { IngestionFile, Alert, Notification } from '../types';

export const mockIngestionFiles: IngestionFile[] = [
  {
    id: 'ING-001', projectId: 'PRJ-001', filename: 'DPR_2209.pdf', fileType: 'PDF',
    discipline: undefined, uploadedAt: '2026-09-22T08:00:00', uploadedBy: 'Ahmed Al-Rashidi',
    eventsExtracted: 14, matchedEvents: 12, contradictions: 1, reviewRequired: 1,
    status: 'Completed',
    processingSteps: [
      { name: 'Uploaded', status: 'done', detail: 'File received: 2.4 MB' },
      { name: 'Parsed', status: 'done', detail: 'Text extracted via OCR: 847 words' },
      { name: 'Events Extracted', status: 'done', detail: '14 execution events identified' },
      { name: 'Activities Matched', status: 'done', detail: '12 activities matched to L5/L6 schedule' },
      { name: 'Confidence Evaluated', status: 'done', detail: 'Avg confidence: 89%; 1 review required' },
    ],
  },
  {
    id: 'ING-002', projectId: 'PRJ-001', filename: 'Site_Diary_22Sep.pdf', fileType: 'PDF',
    discipline: undefined, uploadedAt: '2026-09-22T09:00:00', uploadedBy: 'Sarah Mitchell',
    eventsExtracted: 8, matchedEvents: 7, contradictions: 0, reviewRequired: 1,
    status: 'Completed',
    processingSteps: [
      { name: 'Uploaded', status: 'done', detail: 'File received: 1.1 MB' },
      { name: 'Parsed', status: 'done', detail: 'Text extracted: 524 words' },
      { name: 'Events Extracted', status: 'done', detail: '8 execution events identified' },
      { name: 'Activities Matched', status: 'done', detail: '7 activities matched' },
      { name: 'Confidence Evaluated', status: 'done', detail: 'Avg confidence: 91%; 1 review required' },
    ],
  },
  {
    id: 'ING-003', projectId: 'PRJ-001', filename: 'Contractor_Progress_Sep22.xlsx', fileType: 'XLSX',
    discipline: 'Piping', uploadedAt: '2026-09-22T10:30:00', uploadedBy: 'James Thornton',
    eventsExtracted: 22, matchedEvents: 19, contradictions: 2, reviewRequired: 1,
    status: 'Completed',
    processingSteps: [
      { name: 'Uploaded', status: 'done', detail: 'File received: 0.8 MB' },
      { name: 'Parsed', status: 'done', detail: '22 rows parsed from Sheet1' },
      { name: 'Events Extracted', status: 'done', detail: '22 execution events identified' },
      { name: 'Activities Matched', status: 'done', detail: '19 matched; 3 unmatched' },
      { name: 'Confidence Evaluated', status: 'done', detail: 'Avg confidence: 84%; 2 contradictions, 1 review' },
    ],
  },
  {
    id: 'ING-004', projectId: 'PRJ-001', filename: 'Inspection_Log_21Sep.pdf', fileType: 'PDF',
    discipline: undefined, uploadedAt: '2026-09-21T16:00:00', uploadedBy: 'Maria Santos',
    eventsExtracted: 6, matchedEvents: 5, contradictions: 1, reviewRequired: 0,
    status: 'Completed',
    processingSteps: [
      { name: 'Uploaded', status: 'done', detail: 'File received: 0.6 MB' },
      { name: 'Parsed', status: 'done', detail: 'Text extracted: 312 words' },
      { name: 'Events Extracted', status: 'done', detail: '6 execution events identified' },
      { name: 'Activities Matched', status: 'done', detail: '5 matched; 1 contradiction detected' },
      { name: 'Confidence Evaluated', status: 'done', detail: 'Avg confidence: 87%' },
    ],
  },
  {
    id: 'ING-005', projectId: 'PRJ-001', filename: 'Supervisor_Reports_Batch.csv', fileType: 'CSV',
    discipline: undefined, uploadedAt: '2026-09-21T14:00:00', uploadedBy: 'Ahmed Al-Rashidi',
    eventsExtracted: 18, matchedEvents: 14, contradictions: 0, reviewRequired: 4,
    status: 'Completed',
    processingSteps: [
      { name: 'Uploaded', status: 'done', detail: 'File received: 0.2 MB' },
      { name: 'Parsed', status: 'done', detail: '18 rows parsed' },
      { name: 'Events Extracted', status: 'done', detail: '18 events identified' },
      { name: 'Activities Matched', status: 'done', detail: '14 matched; 4 low confidence' },
      { name: 'Confidence Evaluated', status: 'done', detail: 'Avg confidence: 78%; 4 require review' },
    ],
  },
  {
    id: 'ING-006', projectId: 'PRJ-001', filename: 'DPR_2210_23Sep.pdf', fileType: 'PDF',
    discipline: undefined, uploadedAt: '2026-09-23T07:45:00', uploadedBy: 'Sarah Mitchell',
    eventsExtracted: 0, matchedEvents: 0, contradictions: 0, reviewRequired: 0,
    status: 'Processing',
    processingSteps: [
      { name: 'Uploaded', status: 'done', detail: 'File received: 2.1 MB' },
      { name: 'Parsed', status: 'active', detail: 'Extracting text...' },
      { name: 'Events Extracted', status: 'pending' },
      { name: 'Activities Matched', status: 'pending' },
      { name: 'Confidence Evaluated', status: 'pending' },
    ],
  },
];

export const mockAlerts: Alert[] = [
  { id: 'ALT-001', projectId: 'PRJ-001', severity: 'High', title: 'Conflicting Completion Evidence', description: 'PIP-001-02 has conflicting completion evidence from Supervisor Report and Inspection Log. Immediate review recommended.', timestamp: '2026-09-22T16:45:00', read: false, actionRoute: '/contradictions' },
  { id: 'ALT-002', projectId: 'PRJ-001', severity: 'Medium', title: 'Unconfident Activity Mappings', description: '12 field activities could not be confidently mapped. These require planner review.', timestamp: '2026-09-22T14:10:00', read: false, actionRoute: '/review' },
  { id: 'ALT-003', projectId: 'PRJ-001', severity: 'Medium', title: 'Dependency Inconsistencies', description: '5 dependency inconsistencies detected. Predecessor activities not yet marked complete.', timestamp: '2026-09-22T13:30:00', read: false, actionRoute: '/activities' },
  { id: 'ALT-004', projectId: 'PRJ-001', severity: 'Low', title: 'Stale Actual Progress Data', description: '8 activities have stale actual-progress data older than 48 hours. Field teams may not have reported.', timestamp: '2026-09-22T12:00:00', read: true, actionRoute: '/progress' },
  { id: 'ALT-005', projectId: 'PRJ-001', severity: 'High', title: 'Critical Path Activity Delayed', description: 'MECH-004 (Compressor C-101 Coupling) is on critical path and currently delayed by 1 day.', timestamp: '2026-09-22T17:00:00', read: false, actionRoute: '/timeline' },
];

export const mockNotifications: Notification[] = [
  { id: 'NOT-001', title: 'New DPR Processed', description: 'DPR-2209 has been processed. 14 events extracted, 12 matched.', timestamp: '2026-09-22T08:30:00', read: false, type: 'ingestion', projectId: 'PRJ-001' },
  { id: 'NOT-002', title: 'Contradiction Detected', description: 'PIP-001-02 has conflicting evidence. Planner review required.', timestamp: '2026-09-22T16:45:00', read: false, type: 'contradiction', projectId: 'PRJ-001' },
  { id: 'NOT-003', title: 'Review Item Approved', description: 'Mapping MATCH-006 (Pump P-102 Alignment) approved by Ahmed Al-Rashidi.', timestamp: '2026-09-22T15:00:00', read: true, type: 'review', projectId: 'PRJ-001' },
  { id: 'NOT-004', title: 'New Field Data Ingested', description: 'Contractor_Progress_Sep22.xlsx processed. 2 contradictions detected.', timestamp: '2026-09-22T10:45:00', read: true, type: 'ingestion', projectId: 'PRJ-001' },
  { id: 'NOT-005', title: 'System Sync Complete', description: 'Project PRJ-001 schedule synchronized. 1,250 activities updated.', timestamp: '2026-09-22T07:00:00', read: true, type: 'system', projectId: 'PRJ-001' },
];
;

const mockContradictions = import { Contradiction } from '../types';

export const mockContradictions: Contradiction[] = [
  {
    id: 'CON-001',
    projectId: 'PRJ-001',
    activityId: 'PIP-001-02',
    activityName: 'Hydrotest Line 24-XX',
    discipline: 'Piping',
    severity: 'High',
    status: 'Open',
    evidenceItems: [
      { id: 'EV-001A', source: 'Supervisor Report', sourceType: 'Supervisor Report', timestamp: '2026-09-22T16:20:00', claim: 'Completion Status', value: 'Completed', rawText: 'Line 24-XX hydrotest completed and signed off by Supervisor Ahmed Al-Rashidi at 16:20.' },
      { id: 'EV-001B', source: 'Inspection Report', sourceType: 'Inspection Report', timestamp: '2026-09-22T16:45:00', claim: 'Completion Status', value: 'Pending', rawText: 'Inspection team found Line 24-XX hydrotest still pending at 16:45. Pressure gauge not connected.' },
      { id: 'EV-001C', source: 'Contractor Sheet', sourceType: 'Contractor Sheet', timestamp: '2026-09-22T16:00:00', claim: 'Progress Value', value: '90%', rawText: 'Hydrotest Line 24-XX: 90% complete, awaiting final pressure hold.' },
    ],
    aiConclusion: 'Conflicting completion status detected across three independent sources',
    aiReasoning: 'Supervisor Report claims completion at 16:20. Inspection Report at 16:45 contradicts this, finding work still pending. Contractor Sheet indicates 90% at 16:00. The temporal sequence suggests completion was prematurely reported. The inspection finding at a later timestamp carries higher evidentiary weight.',
    detectedAt: '2026-09-22T17:00:00',
  },
  {
    id: 'CON-002',
    projectId: 'PRJ-001',
    activityId: 'CIV-002',
    activityName: 'Foundation F-102 Formwork',
    discipline: 'Civil',
    severity: 'Medium',
    status: 'Open',
    evidenceItems: [
      { id: 'EV-002A', source: 'Contractor Sheet', sourceType: 'Contractor Sheet', timestamp: '2026-09-22T14:00:00', claim: 'Progress Value', value: '90%', rawText: 'F-102 formwork 90% complete. Remaining work: tie wires on north face.' },
      { id: 'EV-002B', source: 'Supervisor Report', sourceType: 'Supervisor Report', timestamp: '2026-09-22T15:30:00', claim: 'Progress Value', value: '70%', rawText: 'Foundation F-102 formwork at approximately 70%. Crew diverted to other areas this morning.' },
    ],
    aiConclusion: 'Progress percentage discrepancy between contractor and supervisor reports',
    aiReasoning: 'Contractor reports 90% while Supervisor reports 70% — a 20% discrepancy. Possible crew diversion noted in supervisor report. The supervisor observation is later in the day and may reflect actual downtime.',
    detectedAt: '2026-09-22T16:00:00',
  },
  {
    id: 'CON-003',
    projectId: 'PRJ-001',
    activityId: 'INS-001',
    activityName: 'Install Pressure Transmitter PT-104',
    discipline: 'Instrumentation',
    severity: 'High',
    status: 'Open',
    evidenceItems: [
      { id: 'EV-003A', source: 'DPR-2209', sourceType: 'DPR', timestamp: '2026-09-22T08:00:00', claim: 'Activity Status', value: 'Not Started', rawText: 'PT-104 installation not scheduled for today per site plan.' },
      { id: 'EV-003B', source: 'Contractor Sheet', sourceType: 'Contractor Sheet', timestamp: '2026-09-22T11:00:00', claim: 'Activity Status', value: 'Completed', rawText: 'PT-104 installed and cable connected. Tag attached. Calibration pending.' },
    ],
    aiConclusion: 'Activity reported complete while predecessor activity (PIP-001-01) still in progress',
    aiReasoning: 'INS-001 (PT-104 installation) depends on PIP-001-01 (Line 24-XX erection) being complete. PIP-001-01 is currently 85% — not yet finished. Completion of PT-104 before pipe erection completion is physically implausible.',
    detectedAt: '2026-09-22T11:30:00',
  },
  {
    id: 'CON-004',
    projectId: 'PRJ-001',
    activityId: 'MECH-001',
    activityName: 'Pump P-102 Mechanical Alignment',
    discipline: 'Mechanical',
    severity: 'Medium',
    status: 'Under Review',
    evidenceItems: [
      { id: 'EV-004A', source: 'DPR-2209', sourceType: 'DPR', timestamp: '2026-09-22T09:00:00', claim: 'Start Time', value: '09:00', rawText: 'Pump P-102 alignment work commenced at 09:00.' },
      { id: 'EV-004B', source: 'Supervisor Report', sourceType: 'Supervisor Report', timestamp: '2026-09-22T11:00:00', claim: 'Start Time', value: '11:00', rawText: 'P-102 alignment started at 11:00 after specialist arrived on site.' },
    ],
    aiConclusion: 'Conflicting start times reported from two sources for the same activity',
    aiReasoning: 'DPR reports start at 09:00 while Supervisor Report indicates 11:00 start due to specialist delay. The DPR may reflect planned start; actual start was 11:00.',
    detectedAt: '2026-09-22T11:30:00',
  },
  {
    id: 'CON-005',
    projectId: 'PRJ-001',
    activityId: 'PIP-004-01',
    activityName: 'Install Flange Assemblies FA-201',
    discipline: 'Piping',
    severity: 'Medium',
    status: 'Open',
    evidenceItems: [
      { id: 'EV-005A', source: 'Contractor Sheet', sourceType: 'Contractor Sheet', timestamp: '2026-09-22T10:00:00', claim: 'Work Location', value: 'Area-C / Compressor Deck', rawText: 'FA-201 flange installation ongoing at Compressor Deck, Area-C.' },
      { id: 'EV-005B', source: 'DPR-2209', sourceType: 'DPR', timestamp: '2026-09-22T10:30:00', claim: 'Work Location', value: 'Area-B / Pipe Rack', rawText: 'Flange assembly work reported at Pipe Rack, Area-B.' },
    ],
    aiConclusion: 'Activity reported in inconsistent work locations across sources',
    aiReasoning: 'FA-201 is scheduled for Area-C (Compressor Deck). One source confirms this; another places work in Area-B. This may indicate a separate unrelated activity was confused with FA-201 in the field report.',
    detectedAt: '2026-09-22T11:00:00',
  },
  {
    id: 'CON-006',
    projectId: 'PRJ-001',
    activityId: 'ELE-003',
    activityName: 'Terminate MCC Feeder MCC-101',
    discipline: 'Electrical',
    severity: 'Low',
    status: 'Resolved',
    evidenceItems: [
      { id: 'EV-006A', source: 'DPR-2208', sourceType: 'DPR', timestamp: '2026-09-19T17:00:00', claim: 'Completion Status', value: 'Completed', rawText: 'MCC-101 termination completed and punch listed.' },
      { id: 'EV-006B', source: 'DPR-2209', sourceType: 'DPR', timestamp: '2026-09-22T08:00:00', claim: 'Completion Status', value: 'Completed', rawText: 'MCC-101 feeder termination completed. (Repeated entry — same activity as DPR-2208.)' },
    ],
    aiConclusion: 'Duplicate completion event detected for same activity across two DPRs',
    aiReasoning: 'Activity ELE-003 was reported complete in DPR-2208 and again in DPR-2209 three days later. This is likely a transcription error. Resolved: DPR-2208 entry accepted as canonical.',
    detectedAt: '2026-09-22T08:30:00',
    resolvedAt: '2026-09-22T09:00:00',
    resolvedBy: 'Sarah Mitchell',
    resolution: 'DPR-2208 accepted as authoritative. DPR-2209 duplicate entry suppressed.',
  },
  {
    id: 'CON-007',
    projectId: 'PRJ-001',
    activityId: 'CIV-004',
    activityName: 'Grout Foundation Pads FP-201',
    discipline: 'Civil',
    severity: 'Low',
    status: 'Open',
    evidenceItems: [
      { id: 'EV-007A', source: 'Schedule PRJ001', sourceType: 'DPR', timestamp: '2026-09-22T00:00:00', claim: 'Activity Status', value: 'Not Started', rawText: 'CIV-004 — Grout Foundation Pads FP-201: Planned start 22 Sep 2026. Status: Not Started.' },
      { id: 'EV-007B', source: 'Contractor Sheet', sourceType: 'Contractor Sheet', timestamp: '2026-09-22T13:00:00', claim: 'Activity Status', value: 'Completed', rawText: 'FP-201 grouting done. Crew moved off. All pads grouted and levelled.' },
    ],
    aiConclusion: 'Completion reported for activity shown as Not Started in master schedule',
    aiReasoning: 'The master schedule shows CIV-004 as Not Started with planned start 22 Sep. A contractor sheet claims completion by 13:00 on the same day. This suggests either an early start and rapid completion (possible for small grouting scope) or a misidentified activity.',
    detectedAt: '2026-09-22T13:30:00',
  },
];
;

const mockHistoricalData = import { HistoricalActivity } from '../types';

export const mockHistoricalActivities: HistoricalActivity[] = [
  { id: 'HIS-001', projectId: 'PRJ-002', projectName: 'GAS PROCESSING UNIT', activityName: 'Erect Line 16-XX', discipline: 'Piping', plannedDuration: 3, actualDuration: 4, delay: 1, delayCause: 'Crane availability', completedDate: '2026-06-15', location: 'Area-A', similarityScore: 97 },
  { id: 'HIS-002', projectId: 'PRJ-003', projectName: 'PIPELINE DEVELOPMENT', activityName: 'Erect Line 24-YY', discipline: 'Piping', plannedDuration: 3, actualDuration: 5, delay: 2, delayCause: 'Material availability', completedDate: '2026-04-22', location: 'Corridor-A', similarityScore: 94 },
  { id: 'HIS-003', projectId: 'PRJ-002', projectName: 'GAS PROCESSING UNIT', activityName: 'Erect Line 20-CC', discipline: 'Piping', plannedDuration: 2, actualDuration: 3, delay: 1, delayCause: 'Inspection hold', completedDate: '2026-05-10', location: 'Area-B', similarityScore: 91 },
  { id: 'HIS-004', projectId: 'PRJ-003', projectName: 'PIPELINE DEVELOPMENT', activityName: 'Erect Line 12-DD', discipline: 'Piping', plannedDuration: 2, actualDuration: 2, delay: 0, delayCause: 'None', completedDate: '2026-03-18', location: 'Corridor-B', similarityScore: 88 },
  { id: 'HIS-005', projectId: 'PRJ-002', projectName: 'GAS PROCESSING UNIT', activityName: 'Pipe Rack Erection PR-101', discipline: 'Piping', plannedDuration: 4, actualDuration: 6, delay: 2, delayCause: 'Material availability', completedDate: '2026-07-02', location: 'Area-C', similarityScore: 85 },
  { id: 'HIS-006', projectId: 'PRJ-003', projectName: 'PIPELINE DEVELOPMENT', activityName: 'Install Pipe Supports PS-14', discipline: 'Piping', plannedDuration: 1, actualDuration: 1, delay: 0, delayCause: 'None', completedDate: '2026-03-25', location: 'Corridor-A', similarityScore: 82 },
  { id: 'HIS-007', projectId: 'PRJ-002', projectName: 'GAS PROCESSING UNIT', activityName: 'Erect Line 8-EE', discipline: 'Piping', plannedDuration: 2, actualDuration: 4, delay: 2, delayCause: 'Weather', completedDate: '2026-06-28', location: 'Area-A', similarityScore: 79 },
  { id: 'HIS-008', projectId: 'PRJ-003', projectName: 'PIPELINE DEVELOPMENT', activityName: 'Fit-up Flange Line 24-ZZ', discipline: 'Piping', plannedDuration: 1, actualDuration: 2, delay: 1, delayCause: 'Inspection', completedDate: '2026-04-10', location: 'Corridor-C', similarityScore: 76 },
  { id: 'HIS-009', projectId: 'PRJ-002', projectName: 'GAS PROCESSING UNIT', activityName: 'Hydrotest Line 16-XX', discipline: 'Piping', plannedDuration: 1, actualDuration: 1, delay: 0, delayCause: 'None', completedDate: '2026-06-18', location: 'Area-A', similarityScore: 73 },
  { id: 'HIS-010', projectId: 'PRJ-003', projectName: 'PIPELINE DEVELOPMENT', activityName: 'Erect Line 36-AA (Main Header)', discipline: 'Piping', plannedDuration: 5, actualDuration: 7, delay: 2, delayCause: 'Crane availability', completedDate: '2026-02-28', location: 'Corridor-B', similarityScore: 70 },
  { id: 'HIS-011', projectId: 'PRJ-002', projectName: 'GAS PROCESSING UNIT', activityName: 'Foundation F-201 Concreting', discipline: 'Civil', plannedDuration: 2, actualDuration: 3, delay: 1, delayCause: 'Material availability', completedDate: '2026-05-15', location: 'Area-B', similarityScore: 88 },
  { id: 'HIS-012', projectId: 'PRJ-003', projectName: 'PIPELINE DEVELOPMENT', activityName: 'Cable Tray CT-8 Installation', discipline: 'Electrical', plannedDuration: 2, actualDuration: 2, delay: 0, delayCause: 'None', completedDate: '2026-03-10', location: 'Area-C', similarityScore: 85 },
  { id: 'HIS-013', projectId: 'PRJ-002', projectName: 'GAS PROCESSING UNIT', activityName: 'Pump P-201 Alignment', discipline: 'Mechanical', plannedDuration: 2, actualDuration: 3, delay: 1, delayCause: 'Specialist availability', completedDate: '2026-07-20', location: 'Area-D', similarityScore: 90 },
  { id: 'HIS-014', projectId: 'PRJ-003', projectName: 'PIPELINE DEVELOPMENT', activityName: 'Install Flow Transmitter FT-301', discipline: 'Instrumentation', plannedDuration: 1, actualDuration: 2, delay: 1, delayCause: 'Crane availability', completedDate: '2026-04-05', location: 'Area-A', similarityScore: 87 },
  { id: 'HIS-015', projectId: 'PRJ-002', projectName: 'GAS PROCESSING UNIT', activityName: 'Safety Inspection Round SR-10', discipline: 'HSE', plannedDuration: 1, actualDuration: 1, delay: 0, delayCause: 'None', completedDate: '2026-06-01', location: 'Site-Wide', similarityScore: 95 },
];

export const delayCauseData = [
  { name: 'Material availability', value: 31, color: '#2563eb' },
  { name: 'Crane availability', value: 24, color: '#0891b2' },
  { name: 'Inspection', value: 18, color: '#7c3aed' },
  { name: 'Weather', value: 9, color: '#d97706' },
  { name: 'Other', value: 18, color: '#94a3b8' },
];

export const historicalProgressStats = {
  totalSimilar: 47,
  avgPlannedDuration: 3.0,
  avgActualDuration: 4.2,
  avgDelay: 1.2,
  onTimeRate: 38,
};
;

const mockChat = import { ChatMessage } from '../types';

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-0',
    role: 'assistant',
    content: \Hello. I am the **KaryaSetu AI Copilot** for project **OILFIELD EXPANSION (PRJ-001)**.

I can help you understand:
- Project execution status and progress analytics
- Activity mappings and AI confidence explanations
- Contradiction analysis and resolution guidance
- Historical execution patterns from completed projects
- Schedule variance and dependency analysis

What would you like to explore?\,
    timestamp: '2026-09-23T10:55:00',
    sources: [],
  },
];

export const suggestedPrompts = [
   Show todays delayed activities,
 Why was PIP-001-01 matched to the field report?,
 Show unresolved contradictions,
 Which piping activities are currently behind plan?,
 Find historical activities similar to Line 24-XX,
 Show unmatched field activities,
];

export const mockChatResponses: Record<string, { content: string; sources: string[] }> = {
 Show todays delayed activities: {
    content: \## Today's Delayed Activities (22 Sep 2026)

The following activities are currently behind their planned schedule:

| Activity ID | Name | Discipline | Variance | Current Progress |
|---|---|---|---|---|
| PIP-004-01 | Install Flange Assemblies FA-201 | Piping | **+2 days** | 70% |
| CIV-002 | Foundation F-102 Formwork | Civil | **+1 day** | 60% |
| INS-002 | Install Flow Transmitter FT-201 | Instrumentation | **+1 day** | 50% |
| MECH-004 | Compressor C-101 Coupling | Mechanical | **+1 day** | 30% |
| MECH-005 | Heat Exchanger HE-701 Bundle Pull | Mechanical | **+1 day** | 10% |

**⚠ Critical Path Alert:** MECH-004 is on the critical path. Its delay may impact the overall project completion date by **1 day**.

**Root Cause Summary:**
- Crane availability constraints are affecting 3 of 5 delayed activities
- Crew diversion noted on CIV-002 this morning\,
    sources: ['Schedule PRJ001', 'DPR-2209', 'Contractor Sheet'],
  },
  Why was PIP-001-01 matched to the field report?: {
    content: \## AI Matching Explanation: PIP-001-01

**Activity:** Erect Line 24-XX  
**Field Report:** *Spool SP-104 on Line 24-XX erection started at 09:30 AM by Rigging Crew A.*  
**Source:** DPR-2209

### Matching Evidence

✅ **Discipline matched:** Piping — confirmed from context

✅ **Line number matched:** 24-XX directly identified in field text

✅ **Spool identifier detected:** SP-104 is a valid spool on Line 24-XX per BOM

✅ **Semantic similarity:** 93% — field description aligns strongly with L5 activity name

✅ **Date compatible:** 22 Sep 2026 falls within planned execution window (21–23 Sep)

✅ **Historical terminology:** Similar phrasing used in 8 of 15 comparable projects

### Final Confidence: **95%** (Auto Accepted)

Because confidence exceeded the **90% auto-approval threshold**, this mapping was automatically accepted and the actual start date was updated to **22 Sep 2026 09:30**.\,
    sources: ['DPR-2209', 'Schedule PRJ001', 'BOM PRJ001'],
  },
  Show unresolved contradictions: {
    content: \## Unresolved Contradictions (6 Open)

### 🔴 High Severity

**CON-001** — PIP-001-02 (Hydrotest Line 24-XX)  
Supervisor Report says **Completed** at 16:20; Inspection Report says **Pending** at 16:45; Contractor Sheet says **90%** at 16:00.  
*AI conclusion: Inspection finding (later timestamp) suggests premature completion reporting.*

**CON-003** — INS-001 (Install Pressure Transmitter PT-104)  
Contractor Sheet claims **Completed**; however, predecessor activity PIP-001-01 is only **85%** complete.  
*AI conclusion: Physically implausible — installation cannot precede pipe erection completion.*

### 🟡 Medium Severity

**CON-002** — CIV-002 (Foundation F-102 Formwork)  
Contractor: 90% | Supervisor: 70% — 20% discrepancy.

**CON-004** — MECH-001 (Pump P-102 Alignment)  
Start time conflict: DPR says 09:00; Supervisor says 11:00.

**CON-005** — PIP-004-01 (Flange Assemblies FA-201)  
Work location conflict: Area-C vs Area-B.

### 🟢 Low Severity

**CON-007** — CIV-004 (Grout Foundation Pads FP-201)  
Schedule shows Not Started; Contractor reports Completed.

**Recommended Action:** Navigate to the Contradictions page to resolve CON-001 and CON-003 first.\,
    sources: ['DPR-2209', 'Supervisor Report', 'Inspection Log', 'Schedule PRJ001'],
  },
  Which piping activities are currently behind plan?: {
    content: \## Piping Activities Behind Plan

**Discipline:** Piping | **Overall Piping Progress:** 69% (Planned: 74%) | **Variance: -5%**

| Activity | Planned Finish | Actual Progress | Planned Progress | Variance |
|---|---|---|---|---|
| PIP-001-01 Erect Line 24-XX | 23 Sep | 85% | 100% | **–15%** |
| PIP-002-02 Hydrotest Line 18-AA | 22 Sep | 60% | 100% | **–40%** |
| PIP-004-01 Install Flange FA-201 | 21 Sep | 70% | 100% | **+2d delay** |

### Common Delay Factors (from Execution Memory):
- 🏗️ **Crane availability** accounts for 24% of piping delays in similar projects
- 📦 **Material availability** accounts for 31%
- 🔍 **Inspection holds** account for 18%

**Suggested Action:** Review crane allocation schedule. PIP-001-01 and MECH-005 are competing for the same mobile crane.\,
    sources: ['Schedule PRJ001', 'DPR-2209', 'Execution Memory'],
  },
  Find historical activities similar to Line 24-XX: {
    content: \## Historical Activities Similar to Line 24-XX Erection

**47 similar activities** found across completed projects.

| Similarity | Activity | Project | Planned | Actual | Delay | Delay Cause |
|---|---|---|---|---|---|---|
| 97% | Erect Line 16-XX | GAS PROCESSING UNIT | 3d | 4d | +1d | Crane availability |
| 94% | Erect Line 24-YY | PIPELINE DEVELOPMENT | 3d | 5d | +2d | Material availability |
| 91% | Erect Line 20-CC | GAS PROCESSING UNIT | 2d | 3d | +1d | Inspection hold |
| 88% | Erect Line 12-DD | PIPELINE DEVELOPMENT | 2d | 2d | 0d | None |

### Statistical Summary:
- **Average Planned Duration:** 3.0 days
- **Average Actual Duration:** 4.2 days  
- **Average Delay:** 1.2 days
- **On-time rate:** 38%

### ⚠ Prediction for PIP-001-01:
Based on historical patterns, this activity has a **62% probability of a 1–2 day delay**. Primary risk: crane availability conflict with MECH-005.\,
    sources: ['Execution Memory', 'PRJ-002 Archive', 'PRJ-003 Archive'],
  },
  Show unmatched field activities: {
    content: \## Unmatched Field Activities (59 total)

These field observations could not be confidently linked to any L5/L6 schedule activity:

### Recent Unmatched Events (Today)

1. **Piping work completed in Area A.** *(DPR-2209, 14:00)*  
   Confidence: 47% | Reason: Too generic — no activity ID, line number, or spool identifier

2. **Crew working on civil activities near pump area.** *(Supervisor Report, 11:00)*  
   Confidence: 32% | Reason: No specific activity reference; multiple candidates in pump area

3. **Electrical terminations done.** *(Contractor Sheet, 15:30)*  
   Confidence: 41% | Reason: No MCC/JB/panel reference; multiple electrical activities open

### Root Causes:
- 🔤 **Vague language** (43 of 59): No equipment tags or IDs mentioned
- 📍 **Wrong area references** (9 of 59): Area mentioned does not match any open activity
- 📅 **Date mismatches** (7 of 59): Reported event date outside any planned window

**Recommended:** Request field teams to include specific equipment tags in daily reports.\,
    sources: ['DPR-2209', 'Supervisor Report', 'Contractor Sheet', 'Schedule PRJ001'],
  },
};
;

fs.writeFileSync('src/data/mockReports.ts', mockReports, 'utf8');
fs.writeFileSync('src/data/mockContradictions.ts', mockContradictions, 'utf8');
fs.writeFileSync('src/data/mockHistoricalData.ts', mockHistoricalData, 'utf8');
fs.writeFileSync('src/data/mockChat.ts', mockChat, 'utf8');
console.log('All mock data files written successfully!');
