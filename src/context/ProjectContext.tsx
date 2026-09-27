import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  ScheduleActivity,
  ActivityMatch,
  Contradiction,
  Alert,
  Notification,
  IngestionFile,
  FieldUpdate,
  ActivityRemark,
  FieldUpdateSource,
} from '../types';
import { mockProjects, defaultProjectId } from '../data/mockProjects';
import { mockActivities } from '../data/mockActivities';
import { mockActivityMatches } from '../data/mockEvents';
import { mockContradictions } from '../data/mockContradictions';
import { mockAlerts, mockNotifications, mockIngestionFiles } from '../data/mockReports';
import { mockFieldUpdates, mockRemarks } from '../data/mockFieldUpdates';
import { parseFieldText } from '../utils/fieldUpdateParser';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AISettings {
  autoApprovalThreshold: number;
  reviewThreshold: number;
  contradictionAlerts: boolean;
  lowConfidenceAlerts: boolean;
  unmatchedAlerts: boolean;
  darkMode: boolean;
  compactMode: boolean;
}

interface ProjectContextType {
  projects: Project[];
  currentProjectId: string;
  currentProject: Project;
  setCurrentProjectId: (id: string) => void;
  activities: ScheduleActivity[];
  activityMatches: ActivityMatch[];
  contradictions: Contradiction[];
  alerts: Alert[];
  notifications: Notification[];
  ingestionFiles: IngestionFile[];
  aiSettings: AISettings;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  updateAISettings: (settings: Partial<AISettings>) => void;
  approveMapping: (matchId: string, note?: string) => void;
  rejectMapping: (matchId: string, reason?: string) => void;
  remapActivity: (matchId: string, newActivityId: string) => void;
  resolveContradiction: (
    contradictionId: string,
    resolution: string,
    canonicalEvidenceId?: string
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markAlertRead: (id: string) => void;
  addIngestionFile: (file: IngestionFile) => void;
  /* Field-update pipeline (supervisor → AI → planner) */
  fieldUpdates: FieldUpdate[];
  submitFieldUpdate: (input: {
    rawText: string;
    source: FieldUpdateSource;
    submittedBy: string;
    eventType: FieldUpdate['eventType'];
    progressValue?: number;
    activityId?: string;
    note?: string;
  }) => FieldUpdate;
  confirmFieldUpdate: (
    id: string,
    corrections?: Partial<Pick<FieldUpdate, 'eventType' | 'progressValue' | 'rawText' | 'activityId'>>
  ) => void;
  startReviewFieldUpdate: (id: string) => void;
  acceptFieldUpdate: (id: string, correctedActivityId?: string, reviewer?: string) => void;
  rejectFieldUpdate: (id: string, reason?: string) => void;
  /* Discipline remarks */
  remarks: ActivityRemark[];
  addRemark: (input: { activityId: string; author: string; role: string; discipline?: ActivityRemark['discipline']; text: string }) => void;
  stats: {
    overallProgress: number;
    totalActivities: number;
    aiMatched: number;
    pendingReview: number;
    unmatched: number;
    contradictions: number;
    pendingFieldUpdates: number;
  };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProjectId, setCurrentProjectId] = useState<string>(defaultProjectId);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activities, setActivities] = useState<ScheduleActivity[]>(mockActivities);
  const [activityMatches, setActivityMatches] = useState<ActivityMatch[]>(mockActivityMatches);
  const [contradictions, setContradictions] = useState<Contradiction[]>(mockContradictions);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [ingestionFiles, setIngestionFiles] = useState<IngestionFile[]>(mockIngestionFiles);
  const [fieldUpdates, setFieldUpdates] = useState<FieldUpdate[]>(mockFieldUpdates);
  const [remarks, setRemarks] = useState<ActivityRemark[]>(mockRemarks);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [aiSettings, setAiSettings] = useState<AISettings>({
    autoApprovalThreshold: 90,
    reviewThreshold: 70,
    contradictionAlerts: true,
    lowConfidenceAlerts: true,
    unmatchedAlerts: true,
    darkMode: false,
    compactMode: false,
  });

  // Sync dark mode with document root
  useEffect(() => {
    if (aiSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [aiSettings.darkMode]);

  const currentProject =
    projects.find((p) => p.id === currentProjectId) || projects[0];

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateAISettings = (newSettings: Partial<AISettings>) => {
    setAiSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings updated successfully', 'success');
  };

  const approveMapping = (matchId: string) => {
    const match = activityMatches.find((m) => m.id === matchId);
    if (!match) return;

    setActivityMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'Approved',
              reviewedBy: 'Project Planner',
              reviewedAt: new Date().toISOString(),
            }
          : m
      )
    );

    // Update corresponding activity actual progress or start
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === match.activityId) {
          return {
            ...a,
            actualProgress: Math.max(a.actualProgress, a.status === 'Completed' ? 100 : 85),
            status: a.actualProgress >= 100 ? 'Completed' : 'In Progress',
            actualStart: a.actualStart || new Date().toISOString().split('T')[0],
          };
        }
        return a;
      })
    );

    // Update pending count in project
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProjectId
          ? {
              ...p,
              pendingReview: Math.max(0, p.pendingReview - 1),
              aiMatched: p.aiMatched + 1,
            }
          : p
      )
    );

    showToast(`Activity mapping approved for ${match.activityId}`, 'success');
  };

  const rejectMapping = (matchId: string, reason?: string) => {
    const match = activityMatches.find((m) => m.id === matchId);
    if (!match) return;

    setActivityMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'Rejected',
              reviewedBy: 'Project Planner',
              reviewedAt: new Date().toISOString(),
            }
          : m
      )
    );

    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProjectId
          ? {
              ...p,
              pendingReview: Math.max(0, p.pendingReview - 1),
              unmatched: p.unmatched + 1,
            }
          : p
      )
    );

    showToast(
      `Activity mapping rejected${reason ? `: ${reason}` : ''}`,
      'warning'
    );
  };

  const remapActivity = (matchId: string, newActivityId: string) => {
    const targetActivity = activities.find((a) => a.id === newActivityId);
    setActivityMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              activityId: newActivityId,
              status: 'Approved',
              reviewedBy: 'Project Planner (Remapped)',
              reviewedAt: new Date().toISOString(),
            }
          : m
      )
    );

    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProjectId
          ? {
              ...p,
              pendingReview: Math.max(0, p.pendingReview - 1),
              aiMatched: p.aiMatched + 1,
            }
          : p
      )
    );

    showToast(
      `Remapped to ${newActivityId} (${targetActivity?.name || 'Selected'})`,
      'success'
    );
  };

  const resolveContradiction = (
    contradictionId: string,
    resolution: string,
    _canonicalEvidenceId?: string
  ) => {
    setContradictions((prev) =>
      prev.map((c) =>
        c.id === contradictionId
          ? {
              ...c,
              status: resolution === 'Under Review' ? 'Under Review' : 'Resolved',
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Project Planner',
              resolution,
            }
          : c
      )
    );

    if (resolution !== 'Under Review') {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === currentProjectId
            ? { ...p, contradictions: Math.max(0, p.contradictions - 1) }
            : p
        )
      );
      showToast(`Contradiction ${contradictionId} resolved: ${resolution}`, 'success');
    } else {
      showToast(`Contradiction ${contradictionId} kept under review`, 'info');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const addIngestionFile = (file: IngestionFile) => {
    setIngestionFiles((prev) => [file, ...prev]);
    showToast(`File "${file.filename}" queued for ingestion pipeline`, 'info');
  };

  /* ---- Field-update pipeline (supervisor → AI parse → planner validation) ---- */

  const pushHistory = (u: FieldUpdate, status: FieldUpdate['status'], note?: string): FieldUpdate['history'] => [
    ...u.history,
    { status, at: new Date().toISOString(), note },
  ];

  const applyUpdateToSchedule = (activityId: string, update: FieldUpdate) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== activityId) return a;
        const next: ScheduleActivity = { ...a };
        if (update.eventType === 'Start' && !next.actualStart) {
          next.actualStart = new Date().toISOString().split('T')[0];
          next.status = 'In Progress';
          if (next.actualProgress < 5) next.actualProgress = 5;
        } else if (update.eventType === 'Progress' && update.progressValue !== undefined) {
          next.actualProgress = Math.max(next.actualProgress, Math.min(99, update.progressValue));
          next.status = next.actualProgress >= 100 ? 'Completed' : 'In Progress';
          if (!next.actualStart) next.actualStart = new Date().toISOString().split('T')[0];
        } else if (update.eventType === 'Completion') {
          next.actualProgress = 100;
          next.actualFinish = new Date().toISOString().split('T')[0];
          next.status = 'Completed';
        } else if (update.eventType === 'Hold') {
          next.status = 'Blocked';
        }
        next.variance =
          next.actualFinish && next.actualFinish > next.plannedFinish
            ? 1
            : next.status === 'Completed' && next.actualFinish && next.actualFinish < next.plannedFinish
            ? -1
            : next.variance;
        return next;
      })
    );
  };

  const submitFieldUpdate: ProjectContextType['submitFieldUpdate'] = (input) => {
    const parsed = parseFieldText(input.rawText, activities);
    const activityId = input.activityId ?? parsed.activityId;
    const eventType = input.eventType ?? parsed.eventType;
    const progressValue = input.progressValue ?? parsed.progressValue;
    const now = new Date().toISOString();

    let status: FieldUpdate['status'] = 'Submitted';
    if (activityId && parsed.confidence >= aiSettings.autoApprovalThreshold) {
      status = 'Matched';
    } else if (activityId) {
      status = 'Under Review';
    }

    const update: FieldUpdate = {
      id: `FUP-${String(fieldUpdates.length + 1).padStart(3, '0')}-${Math.random().toString(36).slice(2, 5)}`,
      projectId: currentProjectId,
      submittedBy: input.submittedBy,
      submittedAt: now,
      source: input.source,
      rawText: input.rawText,
      eventType,
      progressValue,
      discipline: activityId ? activities.find((a) => a.id === activityId)?.discipline : parsed.discipline,
      activityId,
      suggestedActivityName: activityId ? activities.find((a) => a.id === activityId)?.name : parsed.activityName,
      confidence: parsed.confidence,
      status,
      extracted: { entities: parsed.entities, note: input.note },
      history: [
        { status: 'Submitted', at: now },
        ...(status !== 'Submitted'
          ? [{ status: 'Matched' as const, at: now, note: activityId ? `AI matched to ${activityId} (${parsed.confidence}%)` : undefined }]
          : []),
        ...(status === 'Under Review'
          ? [{ status: 'Under Review' as const, at: now, note: 'Low confidence — routed to Planner queue' }]
          : []),
      ],
    };

    setFieldUpdates((prev) => [update, ...prev]);

    if (status === 'Matched') {
      showToast(`Update auto-matched to ${activityId} (${parsed.confidence}%)`, 'success');
    } else if (status === 'Under Review') {
      showToast(`Matched to ${activityId} at ${parsed.confidence}% — routed to Planner review`, 'info');
    } else {
      showToast('Update submitted — no confident schedule match yet', 'warning');
    }
    return update;
  };

  const confirmFieldUpdate: ProjectContextType['confirmFieldUpdate'] = (id, corrections) => {
    setFieldUpdates((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const merged: FieldUpdate = {
          ...u,
          ...('eventType' in (corrections ?? {}) ? { eventType: corrections!.eventType } : {}),
          ...('progressValue' in (corrections ?? {}) ? { progressValue: corrections!.progressValue } : {}),
          ...('rawText' in (corrections ?? {}) ? { rawText: corrections!.rawText! } : {}),
          ...('activityId' in (corrections ?? {}) ? { activityId: corrections!.activityId } : {}),
          extracted: { ...u.extracted, note: corrections?.rawText ? 'Confirmed with corrections by supervisor' : 'Confirmed by supervisor' },
          history: pushHistory(u, u.status === 'Submitted' ? 'Under Review' : u.status, 'Supervisor confirmed extracted information'),
        };
        if (merged.status === 'Submitted' && merged.activityId) {
          merged.status = 'Under Review';
        }
        return merged;
      })
    );
    showToast('Extracted information confirmed and routed to Planner', 'success');
  };

  const startReviewFieldUpdate: ProjectContextType['startReviewFieldUpdate'] = (id) => {
    setFieldUpdates((prev) =>
      prev.map((u) =>
        u.id === id && u.status === 'Matched'
          ? { ...u, status: 'Under Review', history: pushHistory(u, 'Under Review', 'Routed to Planner queue') }
          : u
      )
    );
  };

  const acceptFieldUpdate: ProjectContextType['acceptFieldUpdate'] = (id, correctedActivityId, reviewer = 'Planner') => {
    const update = fieldUpdates.find((u) => u.id === id);
    if (!update) return;
    const finalActivityId = correctedActivityId ?? update.activityId;

    setFieldUpdates((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: 'Accepted',
              activityId: finalActivityId,
              reviewedBy: reviewer,
              reviewedAt: new Date().toISOString(),
              history: pushHistory(u, 'Accepted', `${reviewer} accepted${correctedActivityId && correctedActivityId !== u.activityId ? ` (corrected to ${correctedActivityId})` : ''}`),
            }
          : u
      )
    );

    if (finalActivityId) applyUpdateToSchedule(finalActivityId, update);
    showToast(`Field update accepted${finalActivityId ? ` — schedule updated for ${finalActivityId}` : ''}`, 'success');
  };

  const rejectFieldUpdate: ProjectContextType['rejectFieldUpdate'] = (id, reason) => {
    setFieldUpdates((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: 'Rejected',
              history: pushHistory(u, 'Rejected', reason || 'Rejected by Planner'),
            }
          : u
      )
    );
    showToast(`Field update rejected${reason ? `: ${reason}` : ''}`, 'warning');
  };

  const addRemark: ProjectContextType['addRemark'] = (input) => {
    const remark: ActivityRemark = {
      id: `RMK-${Date.now().toString(36)}`,
      activityId: input.activityId,
      author: input.author,
      role: input.role,
      discipline: input.discipline,
      text: input.text,
      at: new Date().toISOString(),
    };
    setRemarks((prev) => [remark, ...prev]);
    showToast('Discipline remark added', 'success');
  };

  const openContradictions = contradictions.filter(
    (c) => c.status === 'Open' || c.status === 'Under Review'
  ).length;
  const pendingReviewCount = activityMatches.filter(
    (m) => m.status === 'Review Required'
  ).length;
  const pendingFieldUpdates = fieldUpdates.filter(
    (u) => u.status === 'Submitted' || u.status === 'Matched' || u.status === 'Under Review'
  ).length;

  const stats = {
    overallProgress: currentProject.overallProgress,
    totalActivities: currentProject.totalActivities,
    aiMatched: currentProject.aiMatched,
    pendingReview: pendingReviewCount || currentProject.pendingReview,
    unmatched: currentProject.unmatched,
    contradictions: openContradictions || currentProject.contradictions,
    pendingFieldUpdates,
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProjectId,
        currentProject,
        setCurrentProjectId,
        activities,
        activityMatches,
        contradictions,
        alerts,
        notifications,
        ingestionFiles,
        aiSettings,
        toasts,
        showToast,
        dismissToast,
        updateAISettings,
        approveMapping,
        rejectMapping,
        remapActivity,
        resolveContradiction,
        markNotificationRead,
        markAllNotificationsRead,
        markAlertRead,
        addIngestionFile,
        fieldUpdates,
        submitFieldUpdate,
        confirmFieldUpdate,
        startReviewFieldUpdate,
        acceptFieldUpdate,
        rejectFieldUpdate,
        remarks,
        addRemark,
        stats,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
