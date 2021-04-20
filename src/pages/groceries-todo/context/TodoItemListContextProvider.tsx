import { useEffect, useState } from "react";
import ProductPriceApi from "../../../api/ProductPriceApi";
import StoreApi from "../../../api/StoreApi";
import TodoProductItemsApi from "../../../api/TodoProductItemsApi";
import TodoItem from "../../../components/todo-item-list/types";
import TodoItemListContext from "./TodoItemListContext";

async function enrichTodoItem(item: TodoItem): Promise<void> {
    if (item.targetProduct) {
        const latestPricePromise = ProductPriceApi.fetchLatestPrice(item.targetProduct)
            .then((entry) => {
                if (entry) {
                    // eslint-disable-next-line no-param-reassign
                    item.priceData.latestPrice = entry.price;
                }
            });

        const priceFetchingPromiseList = [latestPricePromise];

        const storeList = await StoreApi.fetchStores();
        storeList.forEach((store) => {
            if (!item.targetProduct) {
                return;
            }

            const { targetProduct } = item;
            const storeName = store.name;
            const fetchPromise = ProductPriceApi.fetchLatestPrice(targetProduct, storeName)
                .then((priceEntry) => {
                    if (!priceEntry) {
                        return;
                    }

                    item.priceData.setCounterpartyPrice(storeName, { price: priceEntry.price });
                });
            priceFetchingPromiseList.push(fetchPromise);
        });

        return Promise.all(priceFetchingPromiseList)
            .then(() => Promise.resolve());
    }
    return Promise.resolve();
}

interface TodoItemListContextProviderProps {

}

const TodoItemListContextProvider = (
    props: React.PropsWithChildren<TodoItemListContextProviderProps>,
) => {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    useEffect(() => {
        TodoProductItemsApi.fetchTodoProductItems()
            .then((fetchedTodoItems) => {
                const promiseList: Promise<any>[] = [];

                fetchedTodoItems.forEach((todoItem) => {
                    const enrichingPromise = enrichTodoItem(todoItem);
                    promiseList.push(enrichingPromise);
                });

                Promise.all(promiseList).then(() => {
                    setTodoItems(fetchedTodoItems);
                });
            });
    }, []);

    const updateItemQuantity = (item: TodoItem, quantity: number) => {
        // eslint-disable-next-line no-param-reassign
        item.quantity = quantity;
        TodoProductItemsApi.update(item);
        setTodoItems([...todoItems]);
    };

    const addItem = async (item: TodoItem) => {
        const existingTodoItem = todoItems.find((addedTodoItem) => {
            const { targetProduct } = item;
            return addedTodoItem.generalName === item.generalName
                && addedTodoItem.targetProduct?.productBarcode === targetProduct?.productBarcode;
        });

        if (existingTodoItem) {
            updateItemQuantity(existingTodoItem, existingTodoItem.quantity + item.quantity);
            return;
        }

        await TodoProductItemsApi.add(item);

        enrichTodoItem(item).then(() => {
            setTodoItems(todoItems.concat(item));
        });
    };

    const removeItem = (removeTodoItem: TodoItem) => {
        TodoProductItemsApi.remove(removeTodoItem).then(() => {
            setTodoItems(todoItems.filter((item) => item.id !== removeTodoItem.id));
        });
    };

    const toggleItemPurchased = (item: TodoItem, toggle: boolean) => {
        // eslint-disable-next-line no-param-reassign
        item.isBought = toggle;
        TodoProductItemsApi.update(item);
        setTodoItems([...todoItems]);
    };

    const clearItems = () => {
        setTodoItems([]);
        TodoProductItemsApi.clear();
    };

    return (
        <TodoItemListContext.Provider value={{
            todoItems, addItem, removeItem, toggleItemPurchased, updateItemQuantity, clearItems,
        }}>
            {props.children}
        </TodoItemListContext.Provider>
    );
};

export default TodoItemListContextProvider;
