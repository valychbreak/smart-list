import { useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import TodoItem from "../../types";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import { ProductFormFields } from "../../../product-form";
import openFoodFactsService from "../../../../api/open-food-facts-api/open-food-facts.service";
import productDetailsToFormFields from "../utils/product-mapping-utils";

const useTodoItemAddController = () => {
    const [openNewProductDialog, setOpenNewProductDialog] = useState(false);
    const [
        defaultNewProductFields,
        setDefaultNewProductFields
    ] = useState<ProductFormFields | undefined>(undefined);

    const [
        lastBarcodeScanResult,
        setBarcodeScanResult,
    ] = useState<BarcodeScanResult | null>(null);

    const todoItemListContext = useTodoItemListContext();

    const addTodoItem = (todoItem: TodoItem) => {
        todoItemListContext.addItem(todoItem);
    };

    const onBarcodeDetected = async (result: BarcodeScanResult) => {
        const barcode = result.code;
        const barcodeType = result.format;

        const product = await ProductApi.findByBarcode(barcode, barcodeType);
        if (product == null) {
            setBarcodeScanResult({
                code: barcode,
                format: barcodeType,
            });

            const loadedExternalProduct = await openFoodFactsService.fetchProduct(barcode);
            setDefaultNewProductFields(
                productDetailsToFormFields(result, loadedExternalProduct)
            );

            setOpenNewProductDialog(true);
        } else {
            const newItem = TodoItem.fromProduct(product);
            addTodoItem(newItem);
        }
    };

    return {
        openNewProductDialog,
        defaultNewProductFields,
        lastBarcodeScanResult,
        onBarcodeDetected,
        addTodoItem,
        setOpenNewProductDialog,
    };
};

export default useTodoItemAddController;
