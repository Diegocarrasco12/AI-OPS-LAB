type Event = {
  source: string;
  message: string;
  severity: string;
};

const queue: Event[] = [];

export function publish(event: Event) {
  console.log("📨 Event publicado:", event.message);
  queue.push(event);
}

export function consume(): Event[] {
  const eventos = [...queue];
  queue.length = 0;
  return eventos;
}
