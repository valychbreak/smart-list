import { useState } from "react";
import TodoItem from "../../../../pages/groceries-todo/components/TodoItem";

export enum Mode {
    PLANNING,
    PURCHASING
}

const useGroceriesTodoController = () => {
    const [mode, setMode] = useState(Mode.PLANNING);

    const [addingPrice, setAddingPrice] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TodoItem>();

    const enablePurchasingMode = (e: any) => {
        setMode(Mode.PURCHASING);
    }

    const enablePlanningMode = (e: any) => {
        setMode(Mode.PLANNING);
    }


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
        currentMode: mode,
        openPriceSubmission: addingPrice,
        selectedItem: selectedItem,
        showPurchaseAction: mode === Mode.PURCHASING,
        
        enablePurchasingMode: enablePurchasingMode,
        enablePlanningMode: enablePlanningMode,
        onItemPurchaseToggle: onItemPurchaseToggle,
        onPriceSubmissionClose: cancelAddingPrice
    }
}

export default useGroceriesTodoController;
