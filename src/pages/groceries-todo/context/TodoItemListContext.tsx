/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import TodoItem from "../../../components/todo-item-list/types";
import Product from "../../../entity/Product";

export type TodoItemListContextType = {
    todoItems: TodoItem[];

    addItem: (item: TodoItem) => void;
    removeItem: (item: TodoItem) => void;
    updateItem: (item: TodoItem) => void;
    toggleItemPurchased: (item: TodoItem, toggle: boolean) => void;
    updateItemQuantity: (item: TodoItem, quantity: number) => void;
    clearItems: () => void;
};

const TodoItemListContext = React.createContext<TodoItemListContextType>({
    todoItems: [],

    addItem: (item: TodoItem) => {
        throw new Error("No implementation");
    },

    removeItem: (item: TodoItem) => {
        throw new Error("No implementation");
    },

    updateItem: () => {
        throw new Error("No implementation");
    },

    toggleItemPurchased: (item: TodoItem, toggle: boolean) => {
        throw new Error("No implementation");
    },

    updateItemQuantity: (item: TodoItem, quantity: number) => {
        throw new Error("No implementation");
    },

    clearItems: () => {
        throw new Error("No implementation");
    },
});

export const useTodoItemListContext = () => useContext(TodoItemListContext);

export default TodoItemListContext;
