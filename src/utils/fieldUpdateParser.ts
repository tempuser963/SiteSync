import { Discipline, ScheduleActivity } from '../types';

export interface ParsedFieldText {
  eventType: 'Start' | 'Progress' | 'Completion' | 'Hold' | 'Note';
  progressValue?: number;
  discipline?: Discipline;
  activityId?: string;
  activityName?: string;
  confidence: number;
  entities: Record<string, string>;
  evidence: string[];
}

const DISCIPLINE_KEYWORDS: { discipline: Discipline; re: RegExp }[] = [
  { discipline: 'Piping', re: /\b(line|spool|pipe|hydrotest|weld|valve)\b/i },
  { discipline: 'Civil', re: /\b(foundation|concrete|rebar|civil|sleeper|excavat)\w*/i },
  { discipline: 'Electrical', re: /\b(cable|tray|junction|electrical|termination|lighting)\w*/i },
  { discipline: 'Instrumentation', re: /\b(transmitter|instrument|gauge|element|calibrat)\w*/i },
  { discipline: 'Rotating Equipment', re: /\b(pump|compressor|coupling|alignment|motor|turbine)\w*/i },
  { discipline: 'Static Equipment', re: /\b(vessel|exchanger|skid|bundle|tank|column|internals)\w*/i },
  { discipline: 'HSE', re: /\b(permit|safety|hse|drill|inspection round)\w*/i },
];

/**
 * Lightweight natural-language parser for supervisor field reports.
 * Extracts event type, progress %, entities and the best-matching L5/L6 activity.
 */
export function parseFieldText(text: string, activities: ScheduleActivity[]): ParsedFieldText {
  const lower = text.toLowerCase();
  const entities: Record<string, string> = {};
  const evidence: string[] = [];

  // --- Event type: earliest matching verb wins ---
  let eventType: ParsedFieldText['eventType'] = 'Note';
  const verbGroups: { type: ParsedFieldText['eventType']; re: RegExp }[] = [
    { type: 'Hold', re: /\b(hold|halt|stop|paused|wait)\w*/ },
    { type: 'Completion', re: /\b(complet|finish|done|closed)\w*/ },
    { type: 'Start', re: /\b(start|begin|commence|initiat)\w*/ },
    { type: 'Progress', re: /\b(progress|percent|%|reached)\w*/ },
  ];
  let earliest = Infinity;
  for (const g of verbGroups) {
    const m = lower.slice(0, 400).match(g.re);
    if (m && m.index !== undefined && m.index < earliest) {
      earliest = m.index;
      eventType = g.type;
    }
  }
  evidence.push(`Event type "${eventType}" from verb keywords`);

  // --- Progress value ---
  const pct = lower.match(/(\d{1,3})\s*(?:%|percent)/);
  let progressValue: number | undefined;
  if (pct) {
    progressValue = Math.min(100, parseInt(pct[1], 10));
    entities.progress = `${progressValue}%`;
    evidence.push(`Progress ${progressValue}% detected`);
  }

  // --- Time ---
  const time = text.match(/\b(\d{1,2}:\d{2})\b/);
  if (time) {
    entities.time = time[1];
    evidence.push(`Time ${time[1]} detected`);
  }

  // --- Tag-style identifiers (SP-104, PT-104, C-101, F-101, CT-12, HE-701...) ---
  const tag = text.match(/\b([A-Z]{1,3}-\d{2,4}(?:-\d{2,4})?)\b/);
  if (tag) {
    entities.tag = tag[1];
    evidence.push(`Equipment/spool tag ${tag[1]} detected`);
  }

  // --- Discipline ---
  let discipline: Discipline | undefined;
  for (const { discipline: d, re } of DISCIPLINE_KEYWORDS) {
    if (re.test(lower)) {
      discipline = d;
      evidence.push(`${d} discipline keywords matched`);
      break;
    }
  }

  // --- Activity match: explicit activity code first, else keyword/tag overlap ---
  let best: { id: string; name: string; score: number } | undefined;
  const code = text.match(/\b(PIP|CIV|ELE|INS|ROT|STA|HSE)-\d{2,3}(?:-\d{2,3})?\b/i);
  if (code) {
    const hit = activities.find((a) => a.id.toLowerCase() === code[0].toLowerCase());
    if (hit) {
      best = { id: hit.id, name: hit.name, score: 96 };
      evidence.push(`Explicit activity code ${hit.id} matched`);
    }
  }
  if (!best) {
    for (const a of activities) {
      let score = 0;
      if (discipline && a.discipline === discipline) score += 45;
      if (tag) {
        const tagBase = tag[1].split('-')[0];
        if (a.name.toUpperCase().includes(tag[1].toUpperCase())) score += 40;
        else if (a.name.toUpperCase().includes(tagBase.toUpperCase() + '-')) score += 20;
      }
      const words = lower.split(/[^a-z]+/).filter((w) => w.length > 4);
      for (const w of words) {
        if (a.name.toLowerCase().includes(w)) score += 8;
      }
      if (score > (best?.score ?? 0)) best = { id: a.id, name: a.name, score: Math.min(94, score) };
    }
    if (best && best.score >= 55) evidence.push(`Best schedule overlap: ${best.id} (${best.score}%)`);
    else best = undefined;
  }

  let confidence = best ? best.score : 40;
  if (!discipline && best) confidence -= 5;
  if (eventType === 'Note') confidence -= 5;
  confidence = Math.max(35, Math.min(97, confidence));

  return {
    eventType,
    progressValue,
    discipline,
    activityId: best?.id,
    activityName: best?.name,
    confidence,
    entities,
    evidence,
  };
}
