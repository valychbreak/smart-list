import React, { useContext } from "react";
import ProductPriceApi from "../../../../api/ProductPriceApi";
import ProductPriceEntry from "../../../../entity/ProductPriceEntry";
import TodoItem from "../../types";
import ProductPriceForm from "../../../ProductPriceForm";
import GroceriesTodoStoreContext from "../groceries-todo-store-context/groceries-todo-store-context";

interface TodoItemPriceSubmitDialogProps {
    open: boolean;
    selectedItem: TodoItem | null;
    handleClose(): void;
}

const TodoItemPriceSubmitDialog = (props: TodoItemPriceSubmitDialogProps) => {
    const { selectedStore } = useContext(GroceriesTodoStoreContext);

    function onPriceEntrySubmit(priceEntry: ProductPriceEntry) {
        const { selectedItem } = props;

        if (selectedItem?.targetProduct) {
            ProductPriceApi.addPriceEntry(selectedItem.targetProduct, priceEntry)
                .then(() => {
                    props.handleClose();
                });
        }
    }

    return (<>
        {props.open && props.selectedItem
            && <>
                <h3>Add price for {props.selectedItem?.targetProduct?.productFullName}</h3>
                <button onClick={() => props.handleClose()}>Skip / Cancel</button>
                <ProductPriceForm
                    defaultStore={selectedStore}
                    targetProduct={props.selectedItem?.targetProduct}
                    onEntrySubmit={onPriceEntrySubmit}/>
            </>
        }
    </>);
};

export default TodoItemPriceSubmitDialog;
