import { QuaggaJSResultObject } from "@ericblade/quagga2";
import { useContext, useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import Product from "../../../../entity/Product";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import useExtendedState from "../../../use-extended-state";
import TodoItem from "../../types";

const useGroceriesTodoPurchasingController = () => {
    const [isScanning, setScanning] = useState(false);

    const purchasedTodoItem = useExtendedState<TodoItem>();
    const notExistingProductScanResult = useExtendedState<BarcodeScanResult>();
    const newScannedProduct = useExtendedState<Product>();

    const todoItemListContext = useContext(TodoItemListContext);

    function toggleTodoItemPurchaseStatus(item: TodoItem, isChecked: boolean) {
        todoItemListContext.toggleItemPurchased(item, isChecked);

        if (isChecked) {
            purchasedTodoItem.setValue(item);
        } else {
            cancelAddingPrice();
        }
    }

    function cancelAddingPrice() {
        purchasedTodoItem.clearValue();
    }

    const onBarcodeScan = (result: QuaggaJSResultObject) => {
        onBarcodeScanAdapter({
            code: result.codeResult.code,
            format: result.codeResult.format,
        });
    };

    const onBarcodeScanAdapter = (result: BarcodeScanResult) => {
        if (result.code === null) {
            return;
        }

        disableScanner();

        const foundItem: TodoItem | undefined = todoItemListContext.todoItems.find((todoItem) => {
            const { targetProduct } = todoItem;
            return targetProduct?.productBarcode === result.code
                && targetProduct?.productBarcodeType === result.format;
        });

        if (foundItem) {
            toggleTodoItemPurchaseStatus(foundItem, true);
            return;
        }

        ProductApi.findByBarcode(result.code, result.format)
            .then((foundProduct) => {
                if (foundProduct === null) {
                    notExistingProductScanResult.setValue(result);
                    return;
                }

                newScannedProduct.setValue(foundProduct);
            });
    };

    function addPurchasedProduct(product: Product) {
        const newItem = TodoItem.fromProduct(product);
        todoItemListContext.addItem(newItem);
        toggleTodoItemPurchaseStatus(newItem, true);
    }

    const enableScanner = () => setScanning(true);

    const disableScanner = () => setScanning(false);

    return {
        openScanner: isScanning,
        openPriceSubmission: purchasedTodoItem.isSet,
        selectedItem: purchasedTodoItem.value,

        openAddNewProductForm: notExistingProductScanResult.isSet,
        scannedProductResult: notExistingProductScanResult.value,

        openAddProductConfirmation: newScannedProduct.isSet,
        productToAdd: newScannedProduct.value,

        toggleTodoItemPurchaseStatus,
        onPriceSubmissionClose: cancelAddingPrice,
        onBarcodeScan,
        onBarcodeScanAdapter,

        addPurchasedProduct,

        dismissSubmitingNewProduct: () => notExistingProductScanResult.clearValue(),
        dismissAddingProduct: () => newScannedProduct.clearValue(),

        enableScanner,
        disableScanner,
    };
};

export default useGroceriesTodoPurchasingController;
