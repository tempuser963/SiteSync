export type Discipline = 'Civil' | 'Piping' | 'Electrical' | 'Instrumentation' | 'Static Equipment' | 'Rotating Equipment' | 'HSE';
export type ActivityStatus = 'Completed' | 'In Progress' | 'Not Started' | 'Delayed' | 'Blocked';
export type MappingStatus = 'Auto Accepted' | 'Review Required' | 'Approved' | 'Rejected' | 'Unmatched';
export type SeverityLevel = 'High' | 'Medium' | 'Low';
export type ContradictionStatus = 'Open' | 'Resolved' | 'Under Review';

export type UserRole =
  | 'ADMIN'
  | 'PROJECT_MANAGER'
  | 'PROJECT_PLANNER'
  | 'DISCIPLINE_ENGINEER'
  | 'SITE_SUPERVISOR';

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'VIEW_PROGRESS'
  | 'VIEW_ACTIVITIES'
  | 'UPLOAD_REPORT'
  | 'APPROVE_MAPPING'
  | 'REJECT_MAPPING'
  | 'RESOLVE_CONTRADICTION'
  | 'VIEW_MEMORY'
  | 'USE_COPILOT'
  | 'MANAGE_USERS'
  | 'MANAGE_ROLES'
  | 'MANAGE_PROJECTS'
  | 'MANAGE_AI_SETTINGS'
  | 'VIEW_AUDIT_LOG';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  projectIds: string[];
  avatar?: string;
  status: 'Active' | 'Inactive';
  lastActive?: string;
  /** Discipline scope for DISCIPLINE_ENGINEER users */
  discipline?: Discipline;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  result: 'Success' | 'Failed' | 'Warning';
  source: string;
  details?: string;
}

export interface Project { id: string; name: string; location: string; status: 'Active' | 'Completed' | 'On Hold'; overallProgress: number; scheduleStatus: string; lastUpdated: string; totalActivities: number; aiMatched: number; pendingReview: number; unmatched: number; contradictions: number; }
export interface ScheduleActivity { id: string; projectId: string; wbsCode: string; name: string; discipline: Discipline; area: string; plannedStart: string; plannedFinish: string; actualStart?: string; actualFinish?: string; plannedProgress: number; actualProgress: number; status: ActivityStatus; variance: number; predecessors: string[]; resources: string[]; location: string; }
export interface ProgressEvent { id: string; projectId: string; timestamp: string; source: string; rawText: string; discipline: Discipline; activityId?: string; eventType: 'Start' | 'Progress' | 'Completion' | 'Inspection' | 'Hold'; progressValue?: number; extractedEntities: Record<string, string>; }
export interface ActivityMatch { id: string; projectId: string; activityId: string; eventId: string; fieldDescription: string; aiInterpretation: AIInterpretation; semanticScore: number; entityScore: number; overallConfidence: number; status: MappingStatus; matchEvidence: MatchEvidence[]; sourceDocument: string; reviewedBy?: string; reviewedAt?: string; createdAt: string; }
export interface AIInterpretation { discipline: Discipline; activity: string; identifiers: Record<string, string>; eventType: string; timestamp?: string; confidence: number; }
export interface MatchEvidence { type: string; matched: boolean; detail: string; }
export interface Evidence { id: string; source: string; sourceType: 'DPR' | 'Supervisor Report' | 'Inspection Report' | 'Contractor Sheet' | 'Site Diary'; timestamp: string; claim: string; value: string; rawText: string; }
export interface Contradiction { id: string; projectId: string; activityId: string; activityName: string; discipline: Discipline; severity: SeverityLevel; status: ContradictionStatus; evidenceItems: Evidence[]; aiConclusion: string; aiReasoning: string; detectedAt: string; resolvedAt?: string; resolvedBy?: string; resolution?: string; }
export interface HistoricalActivity { id: string; projectId: string; projectName: string; activityName: string; discipline: Discipline; plannedDuration: number; actualDuration: number; delay: number; delayCause: string; completedDate: string; location: string; similarityScore?: number; }
export interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; timestamp: string; sources?: string[]; }
export interface IngestionFile { id: string; projectId: string; filename: string; fileType: 'XLSX' | 'CSV' | 'PDF' | 'TXT'; discipline?: Discipline; uploadedAt: string; uploadedBy: string; eventsExtracted: number; matchedEvents: number; contradictions: number; reviewRequired: number; status: 'Completed' | 'Processing' | 'Error' | 'Queued'; processingSteps: ProcessingStep[]; }
export interface ProcessingStep { name: string; status: 'done' | 'active' | 'pending' | 'error'; detail?: string; }
export interface Alert { id: string; projectId: string; severity: SeverityLevel; title: string; description: string; timestamp: string; read: boolean; actionRoute?: string; }
export interface TimelineEvent { id: string; activityId: string; timestamp: string; eventType: 'Start' | 'Progress' | 'Completion' | 'Inspection' | 'Hold' | 'Milestone'; description: string; source: string; progressValue?: number; performedBy?: string; }
export interface DisciplineProgress { discipline: Discipline; planned: number; actual: number; activities: number; completed: number; }
export interface ProgressDataPoint { date: string; planned: number; actual: number; }
export interface Notification { id: string; title: string; description: string; timestamp: string; read: boolean; type: 'contradiction' | 'review' | 'ingestion' | 'system'; projectId: string; }

/* ---- Supervisor field-update pipeline (Submitted → Matched → Under Review → Accepted) ---- */
export type FieldUpdateStatus = 'Submitted' | 'Matched' | 'Under Review' | 'Accepted' | 'Rejected';
export type FieldUpdateSource = 'Manual Form' | 'AI Time Agent' | 'DPR Upload';

export interface FieldUpdate {
  id: string;
  projectId: string;
  submittedBy: string;
  submittedAt: string;
  source: FieldUpdateSource;
  rawText: string;
  eventType: 'Start' | 'Progress' | 'Completion' | 'Hold' | 'Note';
  progressValue?: number;
  discipline?: Discipline;
  activityId?: string;
  suggestedActivityName?: string;
  confidence?: number;
  status: FieldUpdateStatus;
  extracted: { entities: Record<string, string>; note?: string };
  reviewedBy?: string;
  reviewedAt?: string;
  history: { status: FieldUpdateStatus; at: string; note?: string }[];
}

export interface ActivityRemark {
  id: string;
  activityId: string;
  author: string;
  role: string;
  discipline?: Discipline;
  text: string;
  at: string;
}
