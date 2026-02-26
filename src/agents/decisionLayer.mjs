// src/agent/decisionLayer.mjs
import { getWindow, recordAction } from "./memory.mjs";
import { getExperience } from "./experience.mjs";

const policy = {
  preventiveCooldownMin: 120,
  minConfidenceForAuto: 0.7,
};

function recentlyActedOn(patternId, minutes) {
  const w = getWindow({ minutes, filter: e => e.type === "action_record" });
  return w.some(e => e.raw?.patternId === patternId);
}

export function decideForPattern(pattern) {
  const severity =
    pattern.ratePerHour >= 20 ? "critical" :
    pattern.ratePerHour >= 10 ? "high" :
    "medium";

  const needCooldown = recentlyActedOn(pattern.id, policy.preventiveCooldownMin);

  // Acción preventiva determinista (sin IA) para casos obvios
  if (!needCooldown && pattern.confidence >= policy.minConfidenceForAuto) {
    return {
      wakeBrain: false,
      action: {
        type: "preventive_ticket",
        severity,
        patternId: pattern.id,
        summary: `Patrón repetitivo detectado (${severity})`,
        details: pattern,
      }
    };
  }
const exp = getExperience(pattern.id);

if (exp && exp.confidence > 0.8) {

    return {
        wakeBrain: false,
        action: {
            type: "preventive_ticket",
            severity: "high",
            patternId: pattern.id,
            summary: "Acción automática basada en experiencia previa",
            details: pattern
        }
    };
}

  // Si hay patrón pero no suficiente confianza, despierta Brain para decidir
  return {
    wakeBrain: true,
    reason: needCooldown ? "cooldown_active" : "low_confidence",
    context: { pattern, severity }
  };


}

export function recordDecisionAction(action) {
  recordAction(action);
}
