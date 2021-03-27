import React from "react";
import ProductPriceApi from "../../../../api/ProductPriceApi";
import ProductPriceEntry from "../../../../entity/ProductPriceEntry";
import TodoItem from "../../../../pages/groceries-todo/components/TodoItem";
import ProductPriceForm from "../../../ProductPriceForm";

interface TodoItemPriceSubmitDialogProps {
    open: boolean;
    selectedItem: TodoItem | undefined;
    handleClose(): void;
}

const TodoItemPriceSubmitDialog = (props: TodoItemPriceSubmitDialogProps) => {

    function onPriceEntrySubmit(priceEntry: ProductPriceEntry) {
        const { selectedItem } = props;

        if (selectedItem?.targetProduct) {
            ProductPriceApi.addPriceEntry(selectedItem.targetProduct, priceEntry)
                .then(_ => {
                    props.handleClose();
                });
        }
    }

    return (<>
        {props.open && props.selectedItem && 
            <>
                <h3>Add price for {props.selectedItem?.targetProduct?.productFullName}</h3>
                <button onClick={() => props.handleClose()}>Skip / Cancel</button>
                <ProductPriceForm targetProduct={props.selectedItem?.targetProduct} onEntrySubmit={onPriceEntrySubmit}/>
            </>
        }
    </>)
}

export default TodoItemPriceSubmitDialog;
