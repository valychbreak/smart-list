import React from "react";
import TodoItem from "../../../../pages/groceries-todo/components/TodoItem";
import AddTodoItemComponent from "../todo-item-add";
import TodoListView from "../todo-item-list-view";

const GroceriesTodoPlanningModeView: React.FC<{}> = () => {

    const onTodoItemPurchaseToggle = (todoItem: TodoItem, isBought: boolean) => {
        throw Error("Purchasing is disabled")
    }

    return (<>
        <TodoListView showPurchaseAction={false} 
                      onTodoItemPurchaseToggle={onTodoItemPurchaseToggle} />
        <hr />
        <table>
            <tbody>
                <AddTodoItemComponent />
                <tr>
                    <td colSpan={4}>
                        <p>You are currently in the list preparation mode. Add items you are planning to buy by scanning barcode or typing Product General Name (e.g. milk, tea, bread).</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </>)
}

export default GroceriesTodoPlanningModeView;