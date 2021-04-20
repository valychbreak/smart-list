import { useState } from "react";

export default function useExtendedState<T>() {
    const [value, setValue] = useState<T | null>(null);

    const setValueStrict = (newValue: T) => {
        setValue(newValue);
    };

    const clearValue = () => {
        setValue(null);
    };

    return {
        value,
        isSet: value !== null,
        setValue: setValueStrict,
        clearValue,
    };
}
