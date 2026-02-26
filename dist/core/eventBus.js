const queue = [];
export function publish(event) {
    console.log("📨 Event publicado:", event.message);
    queue.push(event);
}
export function consume() {
    const eventos = [...queue];
    queue.length = 0;
    return eventos;
}
//# sourceMappingURL=eventBus.js.map