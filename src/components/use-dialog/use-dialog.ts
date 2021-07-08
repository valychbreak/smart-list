import { useState } from "react";

function useDialog<T>() {
    const [isOpened, setOpened] = useState(false);
    const [payload, setPayload] = useState<T | null>(null);

    const openDialog = (dialogPayload: T) => {
        setOpened(true);

        // check is required for case when T = void
        if (dialogPayload) {
            setPayload(dialogPayload);
        }
    };

    const closeDialog = () => {
        setOpened(false);
        setPayload(null);
    };

    return {
        isOpened,
        payload,
        openDialog,
        closeDialog,
    };
}

export default useDialog;
