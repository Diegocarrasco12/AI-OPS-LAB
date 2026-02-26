import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// simulamos un ticket real tuyo
const ticket =
  "No hay internet en bodega. El wifi conecta pero no navega desde ayer.";

// llamada al modelo
const response = await client.responses.create({
  model: "gpt-5.2",
  input: [
    {
      role: "system",
      content:
        "Eres un asistente TI experto. Responde SOLO JSON válido."
    },
    {
      role: "user",
      content: `
Clasifica este ticket.

Devuelve JSON con:
- categoria
- urgencia (Baja|Media|Alta)
- accion

Ticket:
${ticket}
`
    }
  ]
});

console.log(response.output_text);
