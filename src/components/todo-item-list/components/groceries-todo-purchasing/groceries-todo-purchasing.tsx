import React, { useState } from "react";
import AddTodoItemComponent from "../todo-item-add";
import TodoListView from "../todo-item-list-view";
import TodoItemPriceSubmitDialog from "../todo-item-price-submit-dialog";
import useGroceriesTodoPurchasingController from "./use-groceries-todo-purchasing-controller";


const GroceriesTodoPurchasingModeView: React.FC<{}> = () => {

    const purchasingController = useGroceriesTodoPurchasingController();

    return (<>
        <TodoItemPriceSubmitDialog open={purchasingController.openPriceSubmission} 
                                   selectedItem={purchasingController.selectedItem} 
                                   handleClose={purchasingController.onPriceSubmissionClose} />

        <TodoListView showPurchaseAction={true} onTodoItemPurchaseToggle={purchasingController.onItemPurchaseToggle}/>
        <hr />
        <table>
            <tbody>
                <AddTodoItemComponent />
                <tr>
                    <td colSpan={4}>
                        <p>You are currently in the purchase mode. Scan or type product's barcode to mark as purchased.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </>)
}

export default GroceriesTodoPurchasingModeView;