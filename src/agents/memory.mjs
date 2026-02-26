// src/agent/memory.mjs
import crypto from "crypto";

const state = {
  events: [],        // ring buffer
  patterns: new Map(),
  actions: [],
  maxEvents: 5000,
  maxActions: 2000,
};

export function normalizeEvent(raw) {
  const ts = raw.ts ?? Date.now();
  const type = raw.type ?? "unknown";
  const entity = raw.entity ?? raw.service ?? raw.host ?? "global";
  const message = (raw.message ?? "").toString();

  const normalizedMsg = message
    .toLowerCase()
    .replace(/\b\d+\b/g, "<n>")
    .replace(/[a-f0-9]{8,}/g, "<hex>")
    .replace(/\s+/g, " ")
    .trim();

  const fingerprintBase = `${type}|${entity}|${normalizedMsg}`;
  const fingerprint = crypto.createHash("sha1").update(fingerprintBase).digest("hex");

  return {
    id: raw.id ?? crypto.randomUUID(),
    ts,
    source: raw.source ?? "system",
    type,
    entity,
    severity: raw.severity ?? "info",
    message,
    tags: raw.tags ?? [],
    fingerprint,
    features: raw.features ?? {},
    raw,
  };
}

export function appendEvent(raw) {
  const evt = normalizeEvent(raw);
  state.events.push(evt);
  if (state.events.length > state.maxEvents) state.events.shift();
  return evt;
}

export function getWindow({ minutes = 30, filter } = {}) {
  const since = Date.now() - minutes * 60_000;
  const slice = state.events.filter(e => e.ts >= since);
  return filter ? slice.filter(filter) : slice;
}

export function recordAction(action) {
  state.actions.push({ ...action, ts: action.ts ?? Date.now() });
  if (state.actions.length > state.maxActions) state.actions.shift();
}

export function upsertPattern(pattern) {
  state.patterns.set(pattern.id, pattern);
}

export function getPatterns() {
  return [...state.patterns.values()];
}

export function getStats({ minutes = 30 } = {}) {
  const w = getWindow({ minutes });
  const byFingerprint = new Map();
  for (const e of w) byFingerprint.set(e.fingerprint, (byFingerprint.get(e.fingerprint) ?? 0) + 1);
  return { total: w.length, uniqueFingerprints: byFingerprint.size, byFingerprint };
}
