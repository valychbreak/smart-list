import { useEffect, useState } from "react";
import UserApi from "../../../../api/UserApi";
import TodoItem from "../../types";

export enum Mode {
    PLANNING,
    PURCHASING,
}

const useGroceriesTodoController = () => {
    const [mode, setMode] = useState(Mode.PLANNING);

    useEffect(() => {
        UserApi.fetchGroceriesTodoMode()
            .then((mode) => setMode(mode));
    }, []);

    const switchMode = (mode: Mode) => {
        UserApi.saveGroceriesTodoMode(mode)
            .then((_) => setMode(mode));
    };

    return {
        currentMode: mode,
        showPurchaseAction: mode === Mode.PURCHASING,

        enablePurchasingMode: () => switchMode(Mode.PURCHASING),
        enablePlanningMode: () => switchMode(Mode.PLANNING),
    };
};

export default useGroceriesTodoController;
