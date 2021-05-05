import { useEffect, useState } from "react";

type AsyncAutocompleteControllerProps<T> = {
    loadOptions(inputValue: string): Promise<T[]>;
};

function useAsyncAutocompleteController<T>(props: AsyncAutocompleteControllerProps<T>) {
    const { loadOptions } = props;
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);

    const clear = () => {
        setInputValue("");
        setOpen(false);
        setLoading(false);
        setOptions([]);
    };

    useEffect(() => {
        if (inputValue === "") {
            return undefined;
        }

        let active = true;
        setLoading(true);

        loadOptions(inputValue)
            .then((loadedOptions) => {
                setOptions(loadedOptions);
            })
            .catch(() => { setOptions([]); })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, [inputValue]);

    const handleInputChange = (newInputValue: string) => {
        if (newInputValue === "") {
            clear();
            return;
        }

        setInputValue(newInputValue);
    };

    return {
        open,
        inputValue,
        options,
        loading,
        setOpen,
        setInputValue: handleInputChange,
        clear,
    };
}

export default useAsyncAutocompleteController;
