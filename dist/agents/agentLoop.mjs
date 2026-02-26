import "dotenv/config";
import { obtenerEvento, pushEvent } from "../events/eventQueue.mjs";
import { pensar } from "./brain.mjs";
import { crearTicket } from "../tools/crearTicket.mjs";
import { appendEvent, recordAction } from "./memory.mjs";
import { calcularBaseline } from "./baseline.mjs";
import { detectPatterns } from "./patternDetector.mjs";
import { decideForPattern } from "./decisionLayer.mjs";
import { runPreventiveAction } from "./preventiveEngine.mjs";
import { recordExperience } from "./experience.mjs";
import { observerAgent } from "./observerAgent.mjs";
import { analystAgent } from "./analystAgent.mjs";
import { governorAgent } from "./governorAgent.mjs";
import { adaptiveAgent } from "./adaptiveAgent.mjs";
console.log("\n🤖 AGENTE TI PROACTIVE INICIADO...\n");
const SLEEP = ms => new Promise(r => setTimeout(r, ms));
/* =====================================================
   IA EXECUTION
===================================================== */
async function ejecutarBrain(evento) {
    console.log("🧠 IA despertada...");
    const response = await pensar(evento);
    let resultado = null;
    const functionCall = response.output.find(item => item.type === "function_call");
    if (functionCall) {
        const args = JSON.parse(functionCall.arguments);
        if (!governorAgent("crearTicket")) {
            console.log("🛑 Governor canceló acción IA");
            return null;
        }
        resultado = await crearTicket(args);
        console.log("✅ Ticket creado por agente:");
        console.log(resultado);
        recordAction({
            type: "ticket_creado",
            source: "brain",
            entity: evento.entity,
            data: resultado
        });
        recordExperience(evento.patternId ?? evento.entity, true);
    }
    else {
        console.log("🧠 IA analizó pero no ejecutó acción.");
    }
    return resultado;
}
/* =====================================================
   PATTERN ENGINE
===================================================== */
async function procesarPatrones() {
    const patrones = detectPatterns({
        minutes: 60,
        minRepeats: 3,
        minRatePerHour: 4
    });
    if (!patrones.length)
        return;
    console.log(`📊 Patrones detectados: ${patrones.length}`);
    for (const pattern of patrones) {
        const decision = decideForPattern(pattern);
        if (!decision.wakeBrain) {
            console.log("⚙️ Acción preventiva automática");
            if (!governorAgent("preventive_action")) {
                console.log("🛑 Governor bloqueó acción preventiva");
                continue;
            }
            const res = await runPreventiveAction(decision.action);
            recordAction({
                type: "preventive_action",
                patternId: pattern.id,
                result: res
            });
            if (res.ok) {
                recordExperience(pattern.id, true);
            }
            else {
                recordExperience(pattern.id, false);
            }
        }
        else {
            console.log("🧠 Patrón requiere análisis IA");
            pushEvent({
                type: "pattern_needs_analysis",
                source: "patternDetector",
                severity: "warn",
                entity: pattern.entity,
                message: "Pattern requires AI analysis",
                raw: decision.context
            });
        }
    }
}
/* =====================================================
   MAIN AGENT LOOP
===================================================== */
async function iniciarAgente() {
    while (true) {
        try {
            const evento = obtenerEvento();
            if (evento) {
                console.log("📩 Nuevo evento:", evento);
                observerAgent(evento);
                analystAgent();
                adaptiveAgent();
                // ===============================
                // 3️⃣ Reactive Brain
                // ===============================
                if (evento.type === "anomaly_detected" ||
                    evento.severity === "high") {
                    await ejecutarBrain(evento);
                }
                // ===============================
                // 4️⃣ Proactive Pattern Engine
                // ===============================
                await procesarPatrones();
            }
            else {
                console.log("👀 Agente monitoreando...");
            }
        }
        catch (err) {
            console.error("❌ Error del agente:", err.message);
        }
        await SLEEP(5000);
    }
}
iniciarAgente();
//# sourceMappingURL=agentLoop.mjs.map