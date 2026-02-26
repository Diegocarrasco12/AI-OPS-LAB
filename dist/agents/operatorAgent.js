import { consume } from "../core/eventBus.js";
import { crearTicket } from "../tools/crearTicket.mjs";
export async function operatorAgent() {
    console.log("⚙️ Operator ejecutando acciones...");
    const eventos = consume();
    for (const evento of eventos) {
        if (evento.source !== "brain")
            continue;
        try {
            const data = JSON.parse(evento.message);
            const toolCall = data.output?.[0];
            if (toolCall?.name === "crearTicket") {
                const args = JSON.parse(toolCall.arguments);
                console.log("🎫 Creando ticket automáticamente:", args);
                await crearTicket(args);
            }
        }
        catch (err) {
            console.log("❌ Error ejecutando operador:", err);
        }
    }
}
//# sourceMappingURL=operatorAgent.js.map