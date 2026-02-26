import { getWindow } from "./memory.mjs";

export function calcularBaseline(entity) {

    const eventos = getWindow({
        minutes: 60,
        filter: e => e.entity === entity
    });

    if (!eventos.length) {
        return {
            rate: 0,
            anomaly: false
        };
    }

    const rate = eventos.length / 60;

    return {
        rate,
        anomaly: rate > 3 // threshold inicial simple
    };
}
