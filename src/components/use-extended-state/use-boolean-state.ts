import { useState } from "react";

const useBooleanState = (): [boolean, () => void, () => void] => {
    const [isActive, setActive] = useState(false);

    return [
        isActive,
        () => setActive(true),
        () => setActive(false)
    ];
};

export default useBooleanState;
