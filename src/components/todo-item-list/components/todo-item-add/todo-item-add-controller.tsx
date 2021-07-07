import { useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import TodoItem from "../../types";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import { ProductFormFields } from "../../../product-form";
import openFoodFactsService from "../../../../api/open-food-facts-api/open-food-facts.service";
import productDetailsToFormFields from "../utils/product-mapping-utils";

const useNewProductDialog = () => {
    const [openNewProductDialog, setOpenNewProductDialog] = useState(false);

    const [barcodeScanResult, setBarcodeScanResult] = useState<BarcodeScanResult | null>(null);

    const [
        defaultNewProductFields,
        setDefaultNewProductFields
    ] = useState<ProductFormFields | undefined>(undefined);

    const setNewProductDialogOpened = (
        scanResult: BarcodeScanResult,
        defaultProductFields?: ProductFormFields
    ) => {
        setBarcodeScanResult(scanResult);
        setDefaultNewProductFields(defaultProductFields);
        setOpenNewProductDialog(true);
    };

    return {
        openNewProductDialog,
        setNewProductDialogOpened,
        closeNewProductDialog: () => setOpenNewProductDialog(false),
        payload: {
            barcodeScanResult,
            defaultNewProductFields
        }
    };
};

const useTodoItemAddController = () => {
    const newProductDialog = useNewProductDialog();

    const todoItemListContext = useTodoItemListContext();

    const addTodoItem = (todoItem: TodoItem) => {
        todoItemListContext.addItem(todoItem);
    };

    const onBarcodeDetected = async (result: BarcodeScanResult) => {
        const barcode = result.code;
        const barcodeType = result.format;

        const product = await ProductApi.findByBarcode(barcode, barcodeType);
        if (product == null) {
            const loadedExternalProduct = await openFoodFactsService.fetchProduct(barcode);
            newProductDialog.setNewProductDialogOpened({
                code: barcode,
                format: barcodeType,
            }, productDetailsToFormFields(result, loadedExternalProduct));
        } else {
            const newItem = TodoItem.fromProduct(product);
            addTodoItem(newItem);
        }
    };

    return {
        openNewProductDialog: newProductDialog.openNewProductDialog,
        defaultNewProductFields: newProductDialog.payload.defaultNewProductFields,
        lastBarcodeScanResult: newProductDialog.payload.barcodeScanResult,
        onBarcodeDetected,
        addTodoItem,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setOpenNewProductDialog: (state: boolean) => newProductDialog.closeNewProductDialog(),
    };
};

export default useTodoItemAddController;
