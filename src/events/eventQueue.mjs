import fs from "fs";

const QUEUE_FILE = "./eventQueue.json";

/* =============================
   INIT FILE
============================= */
if (!fs.existsSync(QUEUE_FILE)) {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify([]));
}

/* =============================
   PUSH EVENT
============================= */
export function pushEvent(evento) {

    const queue = JSON.parse(fs.readFileSync(QUEUE_FILE));

    queue.push({
        ts: Date.now(),
        ...evento
    });

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

/* =============================
   GET EVENT
============================= */
export function obtenerEvento() {

    const queue = JSON.parse(fs.readFileSync(QUEUE_FILE));

    if (queue.length === 0) return null;

    const evento = queue.shift();

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));

    return evento;
}
