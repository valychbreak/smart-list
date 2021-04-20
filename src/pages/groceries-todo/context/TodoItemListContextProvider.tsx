import { useEffect, useState } from "react";
import ProductPriceApi from "../../../api/ProductPriceApi";
import StoreApi from "../../../api/StoreApi";
import TodoProductItemsApi from "../../../api/TodoProductItemsApi";
import TodoItem from "../../../components/todo-item-list/types";
import TodoItemListContext from "./TodoItemListContext";

interface TodoItemListContextProviderProps {

}

export const TodoItemListContextProvider = (props: React.PropsWithChildren<TodoItemListContextProviderProps>) => {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    useEffect(() => {
        TodoProductItemsApi.fetchTodoProductItems()
            .then((fetchedTodoItems) => {
                const promiseList: Promise<any>[] = [];
                for (const todoItem of fetchedTodoItems) {
                    const enrichingPromise = enrichTodoItem(todoItem);
                    promiseList.push(enrichingPromise);
                }

                Promise.all(promiseList).then((_) => {
                    setTodoItems(fetchedTodoItems);
                });
            });
    }, []);

    const addItem = async (item: TodoItem) => {
        const existingTodoItem = todoItems.find((addedTodoItem) => addedTodoItem.generalName === item.generalName
                && addedTodoItem.targetProduct?.productBarcode === item.targetProduct?.productBarcode);

        if (existingTodoItem) {
            updateItemQuantity(existingTodoItem, existingTodoItem.quantity + item.quantity);
            return;
        }

        await TodoProductItemsApi.add(item);

        enrichTodoItem(item).then((_) => {
            setTodoItems(todoItems.concat(item));
        });
    };

    const removeItem = (removeItem: TodoItem) => {
        TodoProductItemsApi.remove(removeItem).then((_) => {
            setTodoItems(todoItems.filter((item) => item.id !== removeItem.id));
        });
    };

    const toggleItemPurchased = (item: TodoItem, toggle: boolean) => {
        item.isBought = toggle;
        TodoProductItemsApi.update(item);
        setTodoItems([...todoItems]);
    };

    const updateItemQuantity = (item: TodoItem, quantity: number) => {
        item.quantity = quantity;
        TodoProductItemsApi.update(item);
        setTodoItems([...todoItems]);
    };

    const clearItems = () => {
        setTodoItems([]);
        TodoProductItemsApi.clear();
    };

    const enrichTodoItem = async (item: TodoItem): Promise<void> => {
        if (item.targetProduct) {
            const latestPricePromise = ProductPriceApi.fetchLatestPrice(item.targetProduct).then((entry) => {
                if (entry) {
                    item.priceData.latestPrice = entry.price;
                }
            });

            const priceFetchingPromiseList = [latestPricePromise];

            const storeList = await StoreApi.fetchStores();
            storeList.forEach((store) => {
                if (item.targetProduct) {
                    const fetchPromise = ProductPriceApi.fetchLatestPrice(item.targetProduct, store.name)
                        .then((priceEntry) => {
                            if (priceEntry) {
                                item.priceData.setCounterpartyPrice(store.name, { price: priceEntry.price });
                            }
                        });
                    priceFetchingPromiseList.push(fetchPromise);
                }
            });

            return Promise.all(priceFetchingPromiseList)
                .then((_) => Promise.resolve());
        }
        return Promise.resolve();
    };

    return (
        <TodoItemListContext.Provider value={{
            todoItems, addItem, removeItem, toggleItemPurchased, updateItemQuantity, clearItems,
        }}>
            {props.children}
        </TodoItemListContext.Provider>
    );
};
