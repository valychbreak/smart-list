import { useState } from "react";
import { useHistory } from "react-router-dom";
import ProductApi from "../../../../api/ProductApi";
import TodoItem from "../../types";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";

const useTodoItemAddController = () => {
    const [isScannerEnabled, setScannerEnabled] = useState(false);
    const todoItemListContext = useTodoItemListContext();
    const history = useHistory();

    const enableScanner = () => {
        setScannerEnabled(true);
    };

    const disableScanner = () => {
        setScannerEnabled(false);
    };

    const addTodoItem = (todoItem: TodoItem) => {
        todoItemListContext.addItem(todoItem);
    };

    const onBarcodeDetected = (result: any) => {
        // Before scanner is unmounted, it still able to trigger barcodes detection.
        // Making sure that we trigger scan only once.
        if (!isScannerEnabled) {
            return;
        }

        disableScanner();

        const barcode = result.codeResult?.code;
        const barcodeType = result.codeResult?.format;

        if (barcode && barcodeType) {
            ProductApi.findByBarcode(barcode, barcodeType).then((product) => {
                if (product == null) {
                    // eslint-disable-next-line no-alert
                    if (window.confirm(`Scanned barcode  ${barcode} (${barcodeType}) does not exist in our database. \nDo you want to go to 'Add new item' page?`)) {
                        history.push("new-product");
                    }
                } else {
                    const newItem = TodoItem.fromProduct(product);
                    addTodoItem(newItem);
                }
            });
        }
    };

    return {
        openScanner: isScannerEnabled,
        enableScanner,
        disableScanner,
        onBarcodeDetected,
        addTodoItem,
    };
};

export default useTodoItemAddController;
