import { QuaggaJSResultObject } from "@ericblade/quagga2";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import ProductApi from "../../../../api/ProductApi";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import TodoItem from "../../types";

function useExtendedState<T>() {
    const [value, setValue] = useState<T | null>(null);

    const setValueStrict = (newValue: T) => {
        setValue(newValue);
    }

    const clearValue = () => {
        setValue(null);
    }

    return {
        value: value,
        isSet: value !== null,
        setValue: setValueStrict,
        clearValue: clearValue
    }
}

const useGroceriesTodoPurchasingController = () => {
    const purchasedTodoItem = useExtendedState<TodoItem>();
    const scannedProductResult = useExtendedState<BarcodeScanResult>();

    const todoItemListContext = useContext(TodoItemListContext);
    const history = useHistory();


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
                    // if (window.confirm(`There is no product with barcode ${result.code} in the list and in database.\nDo you want to go to 'Add new item' page?`)) {
                    //     history.push('new-product');
                    // }
                    scannedProductResult.setValue(result);
                    return;
                }

                if (window.confirm(`Scanned product was not added to the list. Do you want to add it?\nProduct: ${foundProduct.productFullName}`)) {
                    const newItem = new TodoItem(Date.now(), foundProduct.productGeneralName);
                    newItem.quantity = 1;
                    newItem.targetProduct = foundProduct;
                    todoItemListContext.addItem(newItem);
                }
            })
    }

    return {
        openPriceSubmission: purchasedTodoItem.isSet,
        selectedItem: purchasedTodoItem.value,

        openAddNewProductForm: scannedProductResult.isSet,
        scannedProductResult: scannedProductResult.value,

        onItemPurchaseToggle: onItemPurchaseToggle,
        onPriceSubmissionClose: cancelAddingPrice,
        onBarcodeScan: onBarcodeScan,
        onBarcodeScanAdapter: onBarcodeScanAdapter
    }
}

export default useGroceriesTodoPurchasingController;