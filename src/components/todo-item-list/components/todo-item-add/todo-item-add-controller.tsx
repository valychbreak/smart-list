import { useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import TodoItem from "../../types";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";

const useTodoItemAddController = () => {
    const [isScannerEnabled, setScannerEnabled] = useState(false);
    const [openNewProductDialog, setOpenNewProductDialog] = useState(false);
    const [
        lastBarcodeScanResult,
        setBarcodeScanResult,
    ] = useState<BarcodeScanResult | null>(null);

    const todoItemListContext = useTodoItemListContext();

    const enableScanner = () => {
        setScannerEnabled(true);
    };

    const disableScanner = () => {
        setScannerEnabled(false);
    };

    const addTodoItem = (todoItem: TodoItem) => {
        todoItemListContext.addItem(todoItem);
    };

    const onBarcodeDetected = (result: BarcodeScanResult) => {
        // Before scanner is unmounted, it still able to trigger barcodes detection.
        // Making sure that we trigger scan only once.
        if (!isScannerEnabled) {
            return;
        }

        disableScanner();

        const barcode = result.code;
        const barcodeType = result.format;

        if (barcode && barcodeType) {
            ProductApi.findByBarcode(barcode, barcodeType).then((product) => {
                if (product == null) {
                    setBarcodeScanResult({
                        code: barcode,
                        format: barcodeType,
                    });
                    setOpenNewProductDialog(true);
                } else {
                    const newItem = TodoItem.fromProduct(product);
                    addTodoItem(newItem);
                }
            });
        }
    };

    return {
        openScanner: isScannerEnabled,
        openNewProductDialog,
        lastBarcodeScanResult,
        enableScanner,
        disableScanner,
        onBarcodeDetected,
        addTodoItem,
        setOpenNewProductDialog,
    };
};

export default useTodoItemAddController;
