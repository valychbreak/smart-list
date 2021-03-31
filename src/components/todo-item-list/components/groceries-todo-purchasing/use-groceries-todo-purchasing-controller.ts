import { QuaggaJSResultObject } from "@ericblade/quagga2";
import { useContext, useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import Product from "../../../../entity/Product";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import useExtendedState from "../../../use-extended-state";
import TodoItem from "../../types";


const useGroceriesTodoPurchasingController = () => {
    const purchasedTodoItem = useExtendedState<TodoItem>();
    const notExistingProductScanResult = useExtendedState<BarcodeScanResult>();
    const newScannedProduct = useExtendedState<Product>();

    const todoItemListContext = useContext(TodoItemListContext);


    function onItemPurchaseToggle(item: TodoItem, isChecked: boolean) {
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
            format: result.codeResult.format
        });
    }

    const onBarcodeScanAdapter = (result: BarcodeScanResult) => {
        if (result.code === null) {
            return;
        }

        const foundItem: TodoItem | undefined = todoItemListContext.todoItems.find(todoItem => {
            const targetProduct = todoItem.targetProduct;
            return targetProduct?.productBarcode === result.code
                && targetProduct?.productBarcodeType === result.format;
        });

        if (foundItem) {
            todoItemListContext.toggleItemPurchased(foundItem, true);
            onItemPurchaseToggle(foundItem, true);
            return;
        }
        
        ProductApi.findByBarcode(result.code, result.format)
            .then(foundProduct => {
                if (foundProduct === null) {
                    notExistingProductScanResult.setValue(result);
                    return;
                }

                newScannedProduct.setValue(foundProduct);
            })
    }

    function addPurchasedProduct(product: Product) {
        const newItem = new TodoItem(Date.now(), product.productGeneralName);
        newItem.quantity = 1;
        newItem.targetProduct = product;
        todoItemListContext.addItem(newItem);
        onItemPurchaseToggle(newItem, true);
    }

    return {
        openPriceSubmission: purchasedTodoItem.isSet,
        selectedItem: purchasedTodoItem.value,

        openAddNewProductForm: notExistingProductScanResult.isSet,
        scannedProductResult: notExistingProductScanResult.value,

        openAddProductConfirmation: newScannedProduct.isSet,
        productToAdd: newScannedProduct.value,

        onItemPurchaseToggle: onItemPurchaseToggle,
        onPriceSubmissionClose: cancelAddingPrice,
        onBarcodeScan: onBarcodeScan,
        onBarcodeScanAdapter: onBarcodeScanAdapter,
        
        addPurchasedProduct: addPurchasedProduct,

        dismissSubmitingNewProduct: () => notExistingProductScanResult.clearValue(),
        dismissAddingProduct: () => newScannedProduct.clearValue()
    }
}

export default useGroceriesTodoPurchasingController;