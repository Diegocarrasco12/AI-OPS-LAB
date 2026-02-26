import "dotenv/config";
import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
export async function pensar(evento) {
    const response = await client.responses.create({
        model: "gpt-5.2",
        tools: [
            {
                type: "function",
                name: "crearTicket",
                description: "Crear ticket de soporte TI",
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
                content: [
                    {
                        type: "input_text",
                        text: `
Eres un agente TI autónomo.

Para cada incidente debes:

1. Analizar el problema
2. Generar internamente un plan corto
3. Ejecutar crearTicket si existe incidente

No expliques el plan al usuario.
Usa herramientas cuando corresponda.
`
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: JSON.stringify(evento, null, 2)
                    }
                ]
            }
        ]
    });
    return response;
}
//# sourceMappingURL=brain.mjs.map