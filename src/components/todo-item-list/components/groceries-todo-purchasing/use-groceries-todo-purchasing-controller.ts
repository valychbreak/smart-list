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

    const enableScanner = () => setScanning(true);

    const disableScanner = () => setScanning(false);

    function cancelAddingPrice() {
        purchasedTodoItem.clearValue();
    }

    function toggleTodoItemPurchaseStatus(item: TodoItem, isChecked: boolean) {
        todoItemListContext.toggleItemPurchased(item, isChecked);

        if (isChecked) {
            purchasedTodoItem.setValue(item);
        } else {
            cancelAddingPrice();
        }
    }

    const onBarcodeScan = (result: BarcodeScanResult) => {
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

    async function toggleTodoItemPurchaseStatusWithScannedResult(todoItem: TodoItem) {
        if (!notExistingProductScanResult.value) {
            throw new Error("Scan result is empty");
        }

        const { code, format } = notExistingProductScanResult.value;
        notExistingProductScanResult.clearValue();

        const product = new Product(todoItem.generalName, code, format);
        const savedProduct = await ProductApi.saveProduct(product);
        const updatedTodoItem = todoItem.clone();
        updatedTodoItem.targetProduct = savedProduct;
        todoItemListContext.updateItem(updatedTodoItem);
        toggleTodoItemPurchaseStatus(updatedTodoItem, true);
    }

    return {
        todoItems: todoItemListContext.todoItems,

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

        addPurchasedProduct,

        dismissSubmitingNewProduct: () => notExistingProductScanResult.clearValue(),
        dismissAddingProduct: () => newScannedProduct.clearValue(),

        enableScanner,
        disableScanner,

        toggleTodoItemPurchaseStatusWithScannedResult,
    };
};

export default useGroceriesTodoPurchasingController;
