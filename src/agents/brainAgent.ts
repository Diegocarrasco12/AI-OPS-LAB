import { consume, publish } from "../core/eventBus.js";
import { pensar } from "./brain.mjs";

export async function brainAgent() {

    console.log("🧠 Brain procesando eventos...");

    const eventos = consume();

    // 🔥 Brain solo piensa si hay eventos
    if (eventos.length === 0) {
        console.log("😴 Sin eventos nuevos, Brain duerme");
        return;
    }

    for (const evento of eventos) {

        const decision = await pensar(evento.message);

        const decisionText =
            typeof decision === "string"
                ? decision
                : JSON.stringify(decision);

        publish({
            source: "brain",
            message: decisionText,
            severity: "decision"
        });
    }
}
