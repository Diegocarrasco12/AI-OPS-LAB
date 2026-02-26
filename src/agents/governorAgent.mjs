import { getWindow } from "./memory.mjs";

const ACTION_LIMIT = 3; // acciones máximas por ventana
const WINDOW_MINUTES = 10;

export function governorAgent(actionType) {

    const recent = getWindow({
        minutes: WINDOW_MINUTES,
        filter: e => e.type === "action_record"
    });

    const sameActions = recent.filter(a => a.actionType === actionType);

    if (sameActions.length >= ACTION_LIMIT) {

        console.log("🛑 Governor bloqueó acción por exceso");

        return false;
    }

    return true;
}
