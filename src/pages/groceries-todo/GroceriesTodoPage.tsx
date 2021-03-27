import React, { useState } from "react";
import space from './icons/space.jfif';
import './GroceriesTodoPage.css'
import TodoItem from "./components/TodoItem";
import TodoListView from "../../components/todo-item-list/components/todo-item-list-view";
import { TodoItemListContextProvider } from "./context/TodoItemListContextProvider";
import { RouteComponentProps, withRouter } from "react-router";
import AddTodoItemComponent from "../../components/todo-item-list/components/todo-item-add";
import TodoItemPriceSubmitDialog from "../../components/todo-item-list/components/todo-item-price-submit-dialog";

const ADDING_ITEMS_MODE = 1;
const PURCHASE_MODE = 2;


const GroceriesTodoPage = (props: RouteComponentProps) => {

    const [mode, setMode] = useState(ADDING_ITEMS_MODE);

    const [addingPrice, setAddingPrice] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TodoItem>();

    function enablePurchaseMode(e: any) {
        setMode(PURCHASE_MODE);
    }

    function enableAddingItemsMode(e: any) {
        setMode(ADDING_ITEMS_MODE);
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

    return (
        <fieldset>
            <legend>Purchase list</legend>
            <div>
                <TodoItemListContextProvider onItemPurchaseToggle={onItemPurchaseToggle}>

                    <TodoItemPriceSubmitDialog open={addingPrice} selectedItem={selectedItem} handleClose={cancelAddingPrice} />
                    <TodoListView />
                    <hr />
                    <table>
                        <tbody>
                            <AddTodoItemComponent />
                            <tr>
                                <td colSpan={2}>
                                    <div className="myBTN">
                                        {mode === ADDING_ITEMS_MODE && <button onClick={enablePurchaseMode}>Purchase mode</button>}
                                        {mode === PURCHASE_MODE && <button onClick={enableAddingItemsMode}>Exit Purchase mode</button>}
                                    </div>
                                    <div className="myBTN">
                                        <button>Export to csv</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    {mode === ADDING_ITEMS_MODE && <p>You are currently in the list preparation mode. Add items you are planning to buy by scanning barcode or typing Product General Name (e.g. milk, tea, bread).</p>}
                                    {mode === PURCHASE_MODE && <p>You are currently in the purchase mode. Scan or type product's barcode to mark as purchased.</p>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </TodoItemListContextProvider>
            </div>
        </fieldset>
    );
}


export default withRouter(GroceriesTodoPage);
