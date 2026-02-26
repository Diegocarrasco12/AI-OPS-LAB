import "dotenv/config";
import { observerAgent } from "./agents/observerAgent.js";
import { analystAgent } from "./agents/analystAgent.js";
import { brainAgent } from "./agents/brainAgent.js";
import { operatorAgent } from "./agents/operatorAgent.js";
console.log("🤖 AI OPS CONTROL PLANE INICIADO");
async function run() {
    while (true) {
        console.log("\n🔄 Nuevo ciclo AI OPS\n");
        await observerAgent();
        await analystAgent();
        await brainAgent();
        await operatorAgent();
        await new Promise(r => setTimeout(r, 5000));
    }
}
run();
//# sourceMappingURL=index.js.map