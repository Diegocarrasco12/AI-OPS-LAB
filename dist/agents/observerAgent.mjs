import { appendEvent } from "./memory.mjs";
import { calcularBaseline } from "./baseline.mjs";
import { pushEvent } from "../events/eventQueue.mjs";
export function observerAgent(evento) {
    // Guardar siempre
    appendEvent(evento);
    // Evitar loops
    if (evento.type === "anomaly_detected")
        return;
    const baseline = calcularBaseline(evento.entity);
    if (baseline.anomaly) {
        console.log("👁️ Observer detectó anomalía");
        pushEvent({
            type: "anomaly_detected",
            entity: evento.entity,
            severity: "high",
            message: "Observer anomaly detection",
            baseline
        });
    }
}
//# sourceMappingURL=observerAgent.mjs.map