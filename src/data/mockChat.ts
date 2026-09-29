import { ChatMessage } from '../types';

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-0',
    role: 'assistant',
    content: `Hello. I am the KaryaSetu AI Copilot for project OILFIELD EXPANSION (PRJ-001).

I can help you understand:
- Project execution status and progress analytics
- Activity mappings and AI confidence explanations
- Contradiction analysis and resolution guidance
- Historical execution patterns from completed projects
- Schedule variance and dependency analysis

What would you like to explore?`,
    timestamp: '2026-09-23T10:55:00',
    sources: [],
  },
];

export const suggestedPrompts = [
  "Show today's delayed activities",
  'Why was PIP-001-01 matched to the field report?',
  'Show unresolved contradictions',
  'Which piping activities are currently behind plan?',
  'Find historical activities similar to Line 24-XX',
  'Show unmatched field activities',
];

export const mockChatResponses: Record<string, { content: string; sources: string[] }> = {
  "Show today's delayed activities": {
    content: `### Today's Delayed Activities (22 Sep 2026)

The following activities are currently behind their planned schedule:

| Activity ID | Name | Discipline | Variance | Current Progress |
|---|---|---|---|---|
| PIP-004-01 | Install Flange Assemblies FA-201 | Piping | **+2 days** | 70% |
| CIV-002 | Foundation F-102 Formwork | Civil | **+1 day** | 60% |
| INS-002 | Install Flow Transmitter FT-201 | Instrumentation | **+1 day** | 50% |
| ROT-004 | Compressor C-101 Coupling | Rotating Equipment | **+1 day** | 30% |
| STA-002 | Heat Exchanger HE-701 Bundle Pull | Static Equipment | **+1 day** | 10% |

**Critical Path Alert:** ROT-004 is on the critical path. Its delay may impact the overall project completion date by **1 day**.

**Root Cause Summary:**
- Crane availability constraints are affecting 3 of 5 delayed activities
- Crew diversion noted on CIV-002 this morning`,
    sources: ['Schedule PRJ001', 'DPR-2209', 'Contractor Sheet'],
  },
  'Why was PIP-001-01 matched to the field report?': {
    content: `### AI Matching Explanation: PIP-001-01

**Activity:** Erect Line 24-XX  
**Field Report:** "Spool SP-104 on Line 24-XX erection started at 09:30 AM by Rigging Crew A."  
**Source:** DPR-2209

#### Matching Evidence

- **Discipline matched:** Piping — confirmed from context
- **Line number matched:** "24-XX" directly identified in field text
- **Spool identifier detected:** "SP-104" is a valid spool on Line 24-XX per BOM
- **Semantic similarity:** 93% — field description aligns strongly with L5 activity name
- **Date compatible:** 22 Sep 2026 falls within planned execution window (21-23 Sep)
- **Historical terminology:** Similar phrasing used in 8 of 15 comparable projects

#### Final Confidence: **95%** (Auto Accepted)

Because confidence exceeded the **90% auto-approval threshold**, this mapping was automatically accepted and the actual start date was updated to **22 Sep 2026 09:30**.`,
    sources: ['DPR-2209', 'Schedule PRJ001', 'BOM PRJ001'],
  },
  'Show unresolved contradictions': {
    content: `### Unresolved Contradictions (6 Open)

#### High Severity
- **CON-001 - PIP-001-02 (Hydrotest Line 24-XX)**
  Supervisor Report says **Completed** at 16:20; Inspection Report says **Pending** at 16:45; Contractor Sheet says **90%** at 16:00.
  *AI conclusion: Inspection finding (later timestamp) suggests premature completion reporting.*

- **CON-003 - INS-001 (Install Pressure Transmitter PT-104)**
  Contractor Sheet claims **Completed**; however, predecessor activity PIP-001-01 is only **85%** complete.
  *AI conclusion: Physically implausible - installation cannot precede pipe erection completion.*

#### Medium Severity
- **CON-002 - CIV-002 (Foundation F-102 Formwork)**
  Contractor: 90% | Supervisor: 70% - 20% discrepancy.
- **CON-004 - ROT-001 (Pump P-102 Alignment)**
  Start time conflict: DPR says 09:00; Supervisor says 11:00.
- **CON-005 - PIP-004-01 (Flange Assemblies FA-201)**
  Work location conflict: Area-C vs Area-B.

#### Low Severity
- **CON-007 - CIV-004 (Grout Foundation Pads FP-201)**
  Schedule shows Not Started; Contractor reports Completed.

*Recommended Action: Navigate to the Contradictions page to review side-by-side evidence and resolve.*`,
    sources: ['DPR-2209', 'Supervisor Report', 'Inspection Log', 'Schedule PRJ001'],
  },
  'Which piping activities are currently behind plan?': {
    content: `### Piping Activities Behind Plan

**Discipline:** Piping | **Overall Piping Progress:** 69% (Planned: 74%) | **Variance: -5%**

| Activity | Planned Finish | Actual Progress | Planned Progress | Variance |
|---|---|---|---|---|
| PIP-001-01 Erect Line 24-XX | 23 Sep | 85% | 100% | **-15%** |
| PIP-002-02 Hydrotest Line 18-AA | 22 Sep | 60% | 100% | **-40%** |
| PIP-004-01 Install Flange FA-201 | 21 Sep | 70% | 100% | **+2d delay** |

#### Common Delay Factors (from Execution Memory):
- **Crane availability** accounts for 24% of piping delays in similar projects
- **Material availability** accounts for 31%
- **Inspection holds** account for 18%

*Suggested Action: Review crane allocation schedule. PIP-001-01 and STA-002 are competing for the same mobile crane.*`,
    sources: ['Schedule PRJ001', 'DPR-2209', 'Execution Memory'],
  },
  'Find historical activities similar to Line 24-XX': {
    content: `### Historical Activities Similar to Line 24-XX Erection

**47 similar activities** found across completed projects.

| Similarity | Activity | Project | Planned | Actual | Delay | Delay Cause |
|---|---|---|---|---|---|---|
| 97% | Erect Line 16-XX | GAS PROCESSING UNIT | 3d | 4d | +1d | Crane availability |
| 94% | Erect Line 24-YY | PIPELINE DEVELOPMENT | 3d | 5d | +2d | Material availability |
| 91% | Erect Line 20-CC | GAS PROCESSING UNIT | 2d | 3d | +1d | Inspection hold |
| 88% | Erect Line 12-DD | PIPELINE DEVELOPMENT | 2d | 2d | 0d | None |

#### Statistical Summary:
- **Average Planned Duration:** 3.0 days
- **Average Actual Duration:** 4.2 days  
- **Average Delay:** 1.2 days
- **On-time rate:** 38%

#### Prediction for PIP-001-01:
Based on historical patterns, this activity has a **62% probability of a 1-2 day delay**. Primary risk: crane availability conflict with STA-002.`,
    sources: ['Execution Memory', 'PRJ-002 Archive', 'PRJ-003 Archive'],
  },
  'Show unmatched field activities': {
    content: `### Unmatched Field Activities (59 total)

These field observations could not be confidently linked to any L5/L6 schedule activity:

#### Recent Unmatched Events (Today)
1. **"Piping work completed in Area A."** *(DPR-2209, 14:00)*  
   Confidence: 47% | Reason: Too generic - no activity ID, line number, or spool identifier
2. **"Crew working on civil activities near pump area."** *(Supervisor Report, 11:00)*  
   Confidence: 32% | Reason: No specific activity reference; multiple candidates in pump area
3. **"Electrical terminations done."** *(Contractor Sheet, 15:30)*  
   Confidence: 41% | Reason: No MCC/JB/panel reference; multiple electrical activities open

#### Root Causes:
- **Vague language** (43 of 59): No equipment tags or IDs mentioned
- **Wrong area references** (9 of 59): Area mentioned does not match any open activity
- **Date mismatches** (7 of 59): Reported event date outside any planned window

*Recommended: Request field teams to include specific equipment tags in daily reports.*`,
    sources: ['DPR-2209', 'Supervisor Report', 'Contractor Sheet', 'Schedule PRJ001'],
  },
};
