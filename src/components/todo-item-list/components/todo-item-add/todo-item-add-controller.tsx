import { useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import TodoItem from "../../types";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import { ProductFormFields } from "../../../product-form";
import openFoodFactsService from "../../../../api/open-food-facts-api/open-food-facts.service";

const useTodoItemAddController = () => {
    const [isScannerEnabled, setScannerEnabled] = useState(false);
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

                    openFoodFactsService.fetchProduct(barcode)
                        .then((loadedExternalProduct) => {
                            if (loadedExternalProduct) {
                                setDefaultNewProductFields({
                                    productBarcode: barcode,
                                    productBarcodeType: barcodeType,
                                    productCompanyName: loadedExternalProduct.company,
                                    productCountry: "",
                                    productFullName: loadedExternalProduct.name,
                                    productGeneralName: loadedExternalProduct.name || "",
                                    image: loadedExternalProduct.imageUrl
                                });
                            } else {
                                setDefaultNewProductFields({
                                    productBarcode: barcode,
                                    productBarcodeType: barcodeType,
                                    productCompanyName: "",
                                    productCountry: "",
                                    productFullName: "",
                                    productGeneralName: "",
                                    image: null
                                });
                            }

                            setOpenNewProductDialog(true);
                        });
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
        defaultNewProductFields,
        lastBarcodeScanResult,
        enableScanner,
        disableScanner,
        onBarcodeDetected,
        addTodoItem,
        setOpenNewProductDialog,
    };
};

export default useTodoItemAddController;
