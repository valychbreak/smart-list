import { useContext } from "react";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";

export const useTodoItemsTotalPriceController = () => {
    const todoItemListContext = useContext(TodoItemListContext);

    const totalPriceByCounterparty = (counterparty: string): number => {
        return todoItemListContext.todoItems
            .map(todoItem => {
                const priceData = todoItem.priceData.perCounterpartyPrice[counterparty];
                return priceData ? priceData.price * todoItem.quantity : 0;
            })
            .reduce((previousValue: number, currentValue: number) => {
                return previousValue + currentValue;
            } , 0);
    }

    return {
        totalPriceByCounterparty: totalPriceByCounterparty
    }
}
