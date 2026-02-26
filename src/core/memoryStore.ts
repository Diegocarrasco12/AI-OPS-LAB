type MemoryRecord = {
  message: string;
  timestamp: number;
};

const memoria: MemoryRecord[] = [];

export function yaProcesado(message: string): boolean {

  return memoria.some(m => m.message === message);
}

export function guardarMemoria(message: string) {

  memoria.push({
    message,
    timestamp: Date.now()
  });

  console.log("🧠 Memoria guardada:", message);
}
