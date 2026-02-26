// src/agent/preventiveEngine.mjs
import { getWindow, appendEvent } from "./memory.mjs";
import { crearTicket } from "../tools/crearTicket.mjs";

export async function runPreventiveAction(action) {
  if (action.type !== "preventive_ticket") return { ok: false, error: "Unsupported action" };

  const recent = getWindow({ minutes: 60, filter: e => true });

  const payload = {
    titulo: `[PROACTIVE][${action.severity.toUpperCase()}] ${action.summary}`,
    descripcion: [
      `PatternId: ${action.patternId}`,
      `Rate/h: ${action.details.ratePerHour.toFixed(2)}`,
      `CountWindow: ${action.details.countWindow}`,
      `Entity: ${action.details.entity}`,
      `Confidence: ${action.details.confidence}`,
      ``,
      `Evidencia (últimos 60 min):`,
      ...recent.slice(-20).map(e => `- ${new Date(e.ts).toISOString()} ${e.type} ${e.entity} :: ${e.message}`),
      ``,
      `Acción sugerida: Revisar causa raíz / aplicar mitigación preventiva.`,
    ].join("\n"),
    tags: ["proactive", "pattern", action.severity, action.details.entity],
  };

  const res = await crearTicket(payload);

  // Registrar como evento para cooldown / auditoría
  appendEvent({
    type: "action_record",
    source: "preventiveEngine",
    message: `Preventive ticket created`,
    severity: "info",
    entity: action.details.entity,
    raw: { patternId: action.patternId, ticket: res },
  });

  return { ok: true, ticket: res };
}
