import { useState } from "react";
import TodoItem from "../../../../pages/groceries-todo/components/TodoItem";

const useGroceriesTodoPurchasingController = () => {
    const [addingPrice, setAddingPrice] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TodoItem>();


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

    return {
        openPriceSubmission: addingPrice,
        selectedItem: selectedItem,

        onItemPurchaseToggle: onItemPurchaseToggle,
        onPriceSubmissionClose: cancelAddingPrice
    }
}

export default useGroceriesTodoPurchasingController;