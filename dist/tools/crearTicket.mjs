export async function crearTicket(data) {
    console.log("\n🛠 IA decidió crear un ticket...\n");
    // simulamos base de datos
    const ticketID = "TCK-" + Math.floor(Math.random() * 10000);
    return {
        ticket_id: ticketID,
        categoria: data.categoria,
        urgencia: data.urgencia,
        estado: "CREADO",
        asignado_a: "Soporte TI"
    };
}
//# sourceMappingURL=crearTicket.mjs.map