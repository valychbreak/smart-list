import { useState } from "react";
import COUNTERPARTY_LIST from "../../../api/Constants";
import ProductPriceApi from "../../../api/ProductPriceApi";
import TodoItem from "../components/TodoItem";
import TodoItemListContext from "./TodoItemListContext";

interface TodoItemListContextProviderProps {
    onItemPurchaseToggle(item: TodoItem, isChecked: boolean): void;
}

export const TodoItemListContextProvider = (props: React.PropsWithChildren<TodoItemListContextProviderProps>) => {
    
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    function addItem(item: TodoItem) {
        if (item.targetProduct) {
            let latestPricePromise = ProductPriceApi.fetchLatestPrice(item.targetProduct).then((entry) => {
                if (entry) {
                    item.priceData.latestPrice = entry.price;
                }
            });

            let counterpartyPriceFetchList = [latestPricePromise];

            COUNTERPARTY_LIST.forEach(counterparty => {
                if (item.targetProduct) {
                    let fetchPromise = ProductPriceApi.fetchLatestPrice(item.targetProduct, counterparty)
                        .then(priceEntry => {
                            if (priceEntry) {
                                item.priceData.setCounterpartyPrice(counterparty, {price: priceEntry.price});
                            }
                        })
                    counterpartyPriceFetchList.push(fetchPromise);
                }
            });

            Promise.all(counterpartyPriceFetchList).then(_ => {
                setTodoItems(todoItems.concat(item));
            });
        }
    }

    function removeItem(removeItem: TodoItem) {
        setTodoItems(todoItems.filter(item => item.id !== removeItem.id));
    }

    function toggleItemPurchased(item: TodoItem, toggle: boolean) {
        item.isBought = toggle;
        props.onItemPurchaseToggle(item, toggle);
    }

    return (
        <TodoItemListContext.Provider value={{todoItems, addItem: addItem, removeItem: removeItem, toggleItemPurchased}}>
            {props.children}
        </TodoItemListContext.Provider>
    )
}