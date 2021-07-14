import { useEffect, useState } from "react";
import UserApi from "../../../../api/UserApi";

export enum Mode {
    PLANNING,
    PURCHASING,
}

const useGroceriesTodoController = () => {
    const [mode, setMode] = useState(Mode.PLANNING);

    useEffect(() => {
        UserApi.fetchGroceriesTodoMode()
            .then((fetchedMode: Mode) => setMode(fetchedMode));
    }, []);

    const switchMode = (fetchedMode: Mode) => {
        UserApi.saveGroceriesTodoMode(fetchedMode)
            .then(() => setMode(fetchedMode));
    };

    return {
        currentMode: mode,
        showPurchaseAction: mode === Mode.PURCHASING,

        enablePurchasingMode: () => switchMode(Mode.PURCHASING),
        enablePlanningMode: () => switchMode(Mode.PLANNING),
    };
};

export default useGroceriesTodoController;
