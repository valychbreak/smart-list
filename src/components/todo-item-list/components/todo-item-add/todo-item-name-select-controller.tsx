import { useEffect, useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import Product from "../../../../entity/Product";
import { TodoItemNameItem } from "./todo-item-name-select";

function asTodoItemNameItem(product: Product): TodoItemNameItem {
    const label = product.productFullName || product.productGeneralName;
    return {
        label,
        todoItemName: label,
        product
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

        ProductApi.findMatchingBy(inputValue)
            .then((loadedProducts) => {
                const loadedOptions = loadedProducts.map((product) => (
                    asTodoItemNameItem(product)
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
