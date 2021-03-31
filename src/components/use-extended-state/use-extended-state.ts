import { useState } from "react";

export default function useExtendedState<T>() {
    const [value, setValue] = useState<T | null>(null);

    const setValueStrict = (newValue: T) => {
        setValue(newValue);
    }

    const getValueOrThrow = (): T => {
        if (value === null) {
            throw new Error("Value is not present");
        }

        return value;
    }

    const clearValue = () => {
        setValue(null);
    }

    return {
        value: value,
        isSet: value !== null,
        setValue: setValueStrict,
        clearValue: clearValue
    }
}