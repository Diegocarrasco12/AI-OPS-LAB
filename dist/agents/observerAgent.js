import { obtenerTickets } from "../integrations/sgTickets.js";
import { publish } from "../core/eventBus.js";
export async function observerAgent() {
    console.log("👀 Observer activo...");
    const tickets = await obtenerTickets();
    for (const ticket of tickets) {
        const evento = {
            source: "sg_tickets",
            message: ticket.titulo,
            severity: ticket.prioridad
        };
        publish(evento);
    }
}
//# sourceMappingURL=observerAgent.js.map