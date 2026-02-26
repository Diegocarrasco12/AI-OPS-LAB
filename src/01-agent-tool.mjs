import "dotenv/config";
import OpenAI from "openai";
import { crearTicket } from "./tools/crearTicket.mjs";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const ticketTexto =
    "La impresora Zebra de recepción no imprime etiquetas desde hoy.";

// ====== AGENTE ======
const response = await client.responses.create({
    model: "gpt-5.2",

    tools: [
        {
            type: "function",
            name: "crearTicket",
            description: "Crear un ticket de soporte TI",
            parameters: {
                type: "object",
                properties: {
                    categoria: { type: "string" },
                    urgencia: { type: "string" },
                    descripcion: { type: "string" }
                },
                required: ["categoria", "urgencia", "descripcion"]
            }
        }
    ],

    input: [
        {
            role: "system",
            content:
                "Eres un agente TI. TODO incidente reportado por usuario debe generar un ticket usando obligatoriamente la herramienta crearTicket."
        },
        {
            role: "user",
            content: ticketTexto
        }
    ]
});


// ✅ DEBUG EN EL LUGAR CORRECTO
console.log("\n===== DEBUG RESPONSE =====");
console.dir(response, { depth: null });


// ====== DETECTAR FUNCTION CALL ======

const functionCall = response.output.find(
    item => item.type === "function_call"
);

if (functionCall) {

    const args = JSON.parse(functionCall.arguments);

    const resultado = await crearTicket(args);

    console.log("\n✅ RESULTADO DEL AGENTE:");
    console.log(resultado);

} else {
    console.log("La IA decidió NO crear ticket.");
}
