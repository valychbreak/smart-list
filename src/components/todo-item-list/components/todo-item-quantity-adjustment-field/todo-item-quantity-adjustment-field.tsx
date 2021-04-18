import React, { useContext, useReducer, useState } from "react";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import QuantityField from "../../../quantity-field";
import TodoItem from "../../types";

type TodoItemQuantityAdjustmentFieldProps = {
    todoItem: TodoItem
}

const TodoItemQuantityAdjustmentField: React.FC<TodoItemQuantityAdjustmentFieldProps> = (props: TodoItemQuantityAdjustmentFieldProps) => {
    
    const todoItemListContext = useContext(TodoItemListContext);

    const changeItemQuantity = (todoItem: TodoItem, quantity: number) => {
        todoItemListContext.updateItemQuantity(todoItem, quantity);
    }

    return (
        <QuantityField defaultQuantity={props.todoItem.quantity} 
            onChange={(newQuantity: number) => changeItemQuantity(props.todoItem, newQuantity)} />
    );
}

export default TodoItemQuantityAdjustmentField;
