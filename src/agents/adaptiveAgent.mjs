import { getWindow } from "./memory.mjs";

let config = {
    anomalyThreshold: 3,
    patternRepeats: 3
};

export function getAdaptiveConfig() {
    return config;
}

export function adaptiveAgent() {

    const recent = getWindow({ minutes: 30 });

    if (recent.length < 10) return;

    const highEvents = recent.filter(e => e.severity === "high").length;

    // demasiado ruido → subir threshold
    if (highEvents > 15) {
        config.anomalyThreshold++;
        console.log("🧠 Adaptive Agent aumentó threshold:", config.anomalyThreshold);
    }

    // sistema muy silencioso → bajar threshold
    if (highEvents < 3 && config.anomalyThreshold > 1) {
        config.anomalyThreshold--;
        console.log("🧠 Adaptive Agent redujo threshold:", config.anomalyThreshold);
    }
}
