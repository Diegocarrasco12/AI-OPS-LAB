export type Ticket = {
  id: number;
  titulo: string;
  prioridad: "baja" | "media" | "alta";
};

export async function obtenerTickets(): Promise<Ticket[]> {

  // Simulación inicial (luego conectamos DB real)
  return [
    {
      id: 101,
      titulo: "Sin internet en bodega",
      prioridad: "alta"
    },
    {
      id: 102,
      titulo: "Impresora Zebra no imprime",
      prioridad: "media"
    }
  ];

}
