import { useEffect, useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import { TodoItemNameItem } from "./todo-item-name-select";

function asTodoItemNameItem(name: string, label?: string): TodoItemNameItem {
    return {
        label: label || name,
        todoItemName: name,
    };
}

const useTodoItemNameSelectController = () => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<TodoItemNameItem[]>([]);
    const [loading, setLoading] = useState(false);

    const clear = () => {
        setInputValue("");
        setOpen(false);
        setLoading(false);
        setOptions([]);
    };

    useEffect(() => {
        if (inputValue === "") {
            clear();
            return undefined;
        }

        let active = true;
        setLoading(true);

        ProductApi.findGeneralNamesBy(inputValue)
            .then((generalNames) => {
                const loadedOptions = generalNames.map((generalName) => (
                    asTodoItemNameItem(generalName)
                ));

                if (active) {
                    setOptions(loadedOptions);
                }
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

    return {
        open,
        inputValue,
        options,
        loading,
        setOpen,
        setInputValue,
        clear,
    };
};

export default useTodoItemNameSelectController;
