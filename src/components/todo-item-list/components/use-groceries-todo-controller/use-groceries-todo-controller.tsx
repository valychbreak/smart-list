import { useState } from "react";
import TodoItem from "../../types";

export enum Mode {
    PLANNING,
    PURCHASING
}

const useGroceriesTodoController = () => {
    const [mode, setMode] = useState(Mode.PLANNING);

    const enablePurchasingMode = (e: any) => {
        setMode(Mode.PURCHASING);
    }

    const enablePlanningMode = (e: any) => {
        setMode(Mode.PLANNING);
    }

    return {
        currentMode: mode,
        showPurchaseAction: mode === Mode.PURCHASING,
        
        enablePurchasingMode: enablePurchasingMode,
        enablePlanningMode: enablePlanningMode
    }
}

export default useGroceriesTodoController;
