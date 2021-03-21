import React from "react";
import TodoItem from "../components/TodoItem";

export type TodoItemListContextType = {
    todoItems: TodoItem[];
    
    addItem: (item: TodoItem) => void;
    removeItem: (item: TodoItem) => void;
    toggleItemPurchased: (item: TodoItem, toggle: boolean) => void;
    clearItems: () => void;
}

const TodoItemListContext = React.createContext<TodoItemListContextType>({
    todoItems: [],

    addItem: (item: TodoItem) => {
        throw new Error("No implementation");
    },

    removeItem: (item: TodoItem) => {
        throw new Error("No implementation");
    },

    toggleItemPurchased: (item: TodoItem, toggle: boolean) => {
        throw new Error("No implementation");
    },

    clearItems: () => {
        throw new Error("No implementation");
    }
});

export default TodoItemListContext;
