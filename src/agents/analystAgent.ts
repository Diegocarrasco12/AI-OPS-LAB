import { consume, publish } from "../core/eventBus.js";

export async function analystAgent() {

  console.log("🧠 Analyst analizando eventos...");

  const eventos = consume();

  if (eventos.length === 0) {
    console.log("📭 No hay eventos para analizar");
    return;
  }

  // Regla simple inicial
  const incidentes = eventos.filter(e => e.severity === "alta");

  for (const incidente of incidentes) {

    const nuevoEvento = {
      source: "analyst",
      message: `INCIDENTE DETECTADO: ${incidente.message}`,
      severity: "critical"
    };

    publish(nuevoEvento);
  }

}
