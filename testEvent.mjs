import { pushEvent } from "./src/events/eventQueue.mjs";

pushEvent({
    type: "api_error",
    entity: "auth-service",
    severity: "high",
    message: "API responding 500"
});

console.log("✅ Evento enviado al agente");
