import { getWindow } from "./memory.mjs";
import { pushEvent } from "../events/eventQueue.mjs";

export function analystAgent() {

    // últimos 10 minutos
    const window = getWindow({ minutes: 10 });

    if (window.length < 5) return;

    const entities = {};

    for (const e of window) {
        entities[e.entity] = (entities[e.entity] || 0) + 1;
    }

    const correlated = Object.entries(entities)
        .filter(([_, count]) => count >= 3);

    if (correlated.length >= 2) {

        console.log("🧩 Analyst detectó correlación de servicios");

        pushEvent({
            type: "system_degradation",
            severity: "high",
            message: "Multiple services showing abnormal activity",
            entities: correlated.map(e => e[0])
        });
    }
}
