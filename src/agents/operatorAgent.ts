import { consume } from "../core/eventBus.js";
import { crearTicket } from "../tools/crearTicket.mjs";
import { yaProcesado, guardarMemoria } from "../core/memoryStore.js";

export async function operatorAgent() {

    console.log("⚙️ Operator ejecutando acciones...");

    const eventos = consume();

    for (const evento of eventos) {

        if (evento.source !== "brain") continue;

        if (yaProcesado(evento.message)) {
            console.log("🧠 Evento ya atendido, evitando duplicado");
            continue;
        }

        try {

            console.log("⚙️ Procesando decisión IA...");

            const data = JSON.parse(evento.message);
            const toolCall = data?.output?.[0];

            if (!toolCall) {
                console.log("⚠️ Brain no generó tool call");
                continue;
            }

            if (toolCall.name === "crearTicket") {

                const args = JSON.parse(toolCall.arguments);

                console.log("🎫 Creando ticket automáticamente:", args);

                await crearTicket(args);

                guardarMemoria(evento.message);
            }

        } catch (err) {
            console.log("❌ Error ejecutando operador:", err);
        }
    }
}