import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
export async function crearPlan(evento) {
    const response = await client.responses.create({
        model: "gpt-5.2",
        input: [
            {
                role: "system",
                content: "Eres un ingeniero TI senior. Genera un plan corto de acciones para resolver el incidente."
            },
            {
                role: "user",
                content: evento
            }
        ]
    });
    return response.output_text;
}
//# sourceMappingURL=planner.mjs.map