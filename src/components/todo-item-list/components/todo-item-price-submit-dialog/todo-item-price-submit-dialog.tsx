import React, { useContext } from "react";
import TodoItem from "../../types";
import ProductPriceForm, { ProductPriceData } from "../../../ProductPriceForm";
import GroceriesTodoStoreContext from "../groceries-todo-store-context/groceries-todo-store-context";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";

interface TodoItemPriceSubmitDialogProps {
    open: boolean;
    selectedItem: TodoItem | null;
    handleClose(): void;
}

const TodoItemPriceSubmitDialog = (props: TodoItemPriceSubmitDialogProps) => {
    const { selectedStore } = useContext(GroceriesTodoStoreContext);
    const { submitPriceEntry } = useTodoItemListContext();

    function onPriceEntrySubmit(formData: ProductPriceData) {
        const { selectedItem } = props;

        if (!selectedItem) {
            return;
        }

        submitPriceEntry(selectedItem, formData).then(() => {
            props.handleClose();
        });
    }

    return (<>
        {props.open && props.selectedItem
            && <>
                <h3>Add price for {props.selectedItem?.targetProduct?.productFullName}</h3>
                <button onClick={() => props.handleClose()}>Skip / Cancel</button>
                <ProductPriceForm
                    defaultStore={selectedStore}
                    targetProduct={props.selectedItem?.targetProduct}
                    onSubmit={onPriceEntrySubmit}/>
            </>
        }
    </>);
};

export default TodoItemPriceSubmitDialog;
