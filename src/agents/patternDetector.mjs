// src/agent/patternDetector.mjs
import { getWindow, getPatterns, upsertPattern } from "./memory.mjs";
import crypto from "crypto";

function patternIdFrom(fp, entity) {
  return crypto.createHash("sha1").update(`${fp}|${entity}`).digest("hex");
}

export function detectPatterns({ minutes = 60, minRepeats = 3, minRatePerHour = 4 } = {}) {
  const w = getWindow({ minutes });
  const counts = new Map();
  for (const e of w) {
    const key = `${e.fingerprint}|${e.entity}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const existing = new Map(getPatterns().map(p => [p.key, p]));
  const detected = [];

  for (const [key, count] of counts.entries()) {
    const ratePerHour = (count / minutes) * 60;
    if (count < minRepeats && ratePerHour < minRatePerHour) continue;

    const prev = existing.get(key);
    const now = Date.now();

    const pattern = {
      id: prev?.id ?? patternIdFrom(key, "p"),
      key,
      fingerprint: key.split("|")[0],
      entity: key.split("|")[1],
      firstSeen: prev?.firstSeen ?? now,
      lastSeen: now,
      countWindow: count,
      ratePerHour,
      occurrencesTotal: (prev?.occurrencesTotal ?? 0) + count,
      confidence: Math.min(0.95, 0.5 + Math.log1p(count) / 5),
      status: "active",
    };

    upsertPattern(pattern);
    detected.push(pattern);
  }

  return detected;
}
