import React, { useContext } from "react";
import TodoItem from "./TodoItem";
import TodoListItemView from "./TodoListItemView";
import remove from '../icons/remove.jfif';
import add from '../icons/add2.png';
import COUNTERPARTY_LIST from "../../../api/Constants";
import TodoItemListContext from "../context/TodoItemListContext";


const TodoListView = () => {

    const todoItemListProvider = useContext(TodoItemListContext);
    return (
        <table>
            <thead>
                <tr className="cpty">
                    <td className="T_action_button">
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
                {todoItemListProvider.todoItems.map((item: TodoItem, idx: number) => (
                    <TodoListItemView item={item} key={idx}/>
                ))}
            </tbody>
        </table>

    );
}

export default TodoListView;
