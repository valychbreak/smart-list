import React, { useContext } from "react";
import TodoItem from "../../types";
import TodoListItemView from "../../../../pages/groceries-todo/components/TodoListItemView";
import remove from '../../../icons/remove.jfif';
import add from '../../../icons/add2.png';
import COUNTERPARTY_LIST from "../../../../api/Constants";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";

interface TodoListViewProps {
    showPurchaseAction?: boolean;
    onTodoItemPurchaseToggle(todoItem: TodoItem, isBought: boolean): void;
}

const TodoListView: React.FC<TodoListViewProps> = ({
        showPurchaseAction = false, 
        ...props}
    ) => {

    const todoItemListContext = useContext(TodoItemListContext);

    const clearTodoList = () => {
        if (window.confirm("Are you sure you want to clear the list? CANNOT BE UNDONE!")) {
            todoItemListContext.clearItems();
        }
    }

    return (<>
        <button onClick={e => clearTodoList()}>CLEAR LIST</button>
        <table>
            <thead>
                <tr className="cpty">
                    <td className="T_action_button" hidden={!showPurchaseAction}>
                        Purchased
                    </td>
                    <td>
                        Item list
                    </td>
                    <td>
                        Quantity
                    </td>
                    <td>
                        Latest price
                    </td>
                    {COUNTERPARTY_LIST.map((counterparty: string, idx: number) => {
                        return <td className="cpty" key={idx}>
                            {counterparty}
                            <img src={remove} alt="remove" className="icons" />
                        </td>
                    })}
                    <td className="T_action_button">
                        <img src={add} alt="add" className="icons" />
                    </td>
                </tr>
            </thead>
            <tbody>
                {todoItemListContext.todoItems.map((item: TodoItem, idx: number) => (
                    <TodoListItemView item={item} 
                                      showPurchaseAction={showPurchaseAction} 
                                      onTodoItemPurchaseToggle={props.onTodoItemPurchaseToggle}
                                      key={idx}/>
                ))}
                <tr>
                    <td hidden={!showPurchaseAction} />
                    <td colSpan={3} />
                    {COUNTERPARTY_LIST.map((counterparty: string, idx: number) => {
                        return <td className="cpty" key={idx}>
                            [total_sum]
                        </td>
                    })}
                </tr>
            </tbody>
        </table>

    </>);
}

export default TodoListView;