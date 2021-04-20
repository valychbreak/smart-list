import { useContext } from "react";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";

export const useTodoItemsTotalPriceController = () => {
    const todoItemListContext = useContext(TodoItemListContext);

    const totalPriceByCounterparty = (counterparty: string): number => todoItemListContext.todoItems
        .map((todoItem) => {
            const priceData = todoItem.priceData.perCounterpartyPrice[counterparty];
            return priceData ? priceData.price * todoItem.quantity : 0;
        })
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);

    return {
        totalPriceByCounterparty,
    };
};
