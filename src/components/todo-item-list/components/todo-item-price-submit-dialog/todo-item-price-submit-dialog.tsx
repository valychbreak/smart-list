import React, { useContext } from "react";
import { Dialog, DialogTitle } from "@material-ui/core";
import TodoItem from "../../types";
import ProductPriceDialogForm, { ProductPriceData } from "../../../product-price-dialog-form/product-price-dialog-form";
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
    const { handleClose, selectedItem } = props;

    const open = props.open && !!selectedItem;
    const product = selectedItem?.targetProduct || null;
    const dialogTitle = product?.productFullName || selectedItem?.generalName;

    return (<>
        <Dialog open={open}>
            <DialogTitle>Add price for {dialogTitle}</DialogTitle>
            <ProductPriceDialogForm
                defaultStore={selectedStore}
                targetProduct={product}
                onSubmit={onPriceEntrySubmit}
                onClose={handleClose}
            />
        </Dialog>
    </>);
};

export default TodoItemPriceSubmitDialog;
