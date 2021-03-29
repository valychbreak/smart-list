import { QuaggaJSResultObject } from "@ericblade/quagga2";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import ProductApi from "../../../../api/ProductApi";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import TodoItem from "../../types";

const useGroceriesTodoPurchasingController = () => {
    const [addingPrice, setAddingPrice] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TodoItem>();

    const todoitemListContext = useContext(TodoItemListContext);
    const history = useHistory();


    function onItemPurchaseToggle(item: TodoItem, isChecked: boolean) {
        if (isChecked) {
            setSelectedItem(item);
            setAddingPrice(true);
        } else {
            cancelAddingPrice();
        }
    }

    function cancelAddingPrice() {
        setSelectedItem(undefined);
        setAddingPrice(false);
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

        const foundItem: TodoItem | undefined = todoitemListContext.todoItems.find(todoItem => {
            const targetProduct = todoItem.targetProduct;
            return targetProduct?.productBarcode === result.code
                && targetProduct?.productBarcodeType === result.format;
        });

        if (foundItem) {
            todoitemListContext.toggleItemPurchased(foundItem, true);
            onItemPurchaseToggle(foundItem, true);
            return;
        }

        
        ProductApi.findByBarcode(result.code, result.format)
            .then(foundProduct => {
                if (foundProduct === null) {
                    if (window.confirm(`There is no product with barcode ${result.code} in the list and in database.\nDo you want to go to 'Add new item' page?`)) {
                        history.push('new-product');
                    }
                    return;
                }
            })
    }

    return {
        openPriceSubmission: addingPrice,
        selectedItem: selectedItem,

        onItemPurchaseToggle: onItemPurchaseToggle,
        onPriceSubmissionClose: cancelAddingPrice,
        onBarcodeScan: onBarcodeScan,
        onBarcodeScanAdapter: onBarcodeScanAdapter
    }
}

export default useGroceriesTodoPurchasingController;