import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";

const useTodoItemsTotalPriceController = () => {
    const todoItemListContext = useTodoItemListContext();

    const totalPriceByCounterparty = (): number => todoItemListContext.todoItems
        .map((todoItem) => {
            const price = todoItem.productPrice;
            return price ? price * todoItem.quantity : 0;
        })
        .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);

    return {
        totalPriceByCounterparty,
    };
};

export default useTodoItemsTotalPriceController;
