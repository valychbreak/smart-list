import { useContext, useEffect, useState } from "react";
import ProductPriceApi from "../../../api/ProductPriceApi";
import TodoProductItemsApi from "../../../api/TodoProductItemsApi";
import { ProductPriceData } from "../../../components/ProductPriceForm";
import { GroceriesTodoStoreContext } from "../../../components/todo-item-list/components/groceries-todo-store-context";
import TodoItem from "../../../components/todo-item-list/types";
import ProductPriceEntry from "../../../entity/ProductPriceEntry";
import TodoItemListContext from "./TodoItemListContext";

interface TodoItemListContextProviderProps {

}

const TodoItemListContextProvider = (
    props: React.PropsWithChildren<TodoItemListContextProviderProps>,
) => {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const { selectedStore, storeList } = useContext(GroceriesTodoStoreContext);

    useEffect(() => {
        TodoProductItemsApi.fetchTodoProductItems(selectedStore?.name)
            .then((fetchedTodoItems) => {
                setTodoItems(fetchedTodoItems);
            });
    }, [selectedStore]);

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

        let createdItem;
        const { targetProduct } = item;
        if (!targetProduct || !selectedStore) {
            createdItem = item;
        } else {
            const priceEntry = await ProductPriceApi.fetchLatestPrice(
                targetProduct, selectedStore.name
            );
            if (priceEntry) {
                createdItem = item.setProductPrice(priceEntry.price);
            } else {
                createdItem = item;
            }
        }

        setTodoItems(todoItems.concat(createdItem));
    };

    const removeItem = (removeTodoItem: TodoItem) => {
        TodoProductItemsApi.remove(removeTodoItem).then(() => {
            setTodoItems(todoItems.filter((item) => item.id !== removeTodoItem.id));
        });
    };

    const updateItem = (updatedTodoItem: TodoItem) => {
        const replacedTodoItems = todoItems.map((existingTodoItem) => (
            existingTodoItem.id === updatedTodoItem.id ? updatedTodoItem : existingTodoItem
        ));

        TodoProductItemsApi.update(updatedTodoItem);

        setTodoItems(replacedTodoItems);
    };

    const toggleItemPurchased = (item: TodoItem, toggle: boolean) => {
        // eslint-disable-next-line no-param-reassign
        item.isBought = toggle;
        updateItem(item);
    };

    const clearItems = () => {
        setTodoItems([]);
        TodoProductItemsApi.clear();
    };

    const submitPriceEntry = async (
        todoItem: TodoItem, productPriceFormData: ProductPriceData
    ): Promise<void> => {
        const store = storeList.find(
            (existingStore) => (
                existingStore.name === productPriceFormData.storeName
            )
        );
        const updatedItem = todoItem
            .setPurchasedPrice(productPriceFormData.price)
            .setPurchasedStore(store || selectedStore);

        updateItem(updatedItem);

        if (productPriceFormData.selectedProduct) {
            const priceEntry = new ProductPriceEntry(
                productPriceFormData.selectedProduct.productBarcode,
                productPriceFormData.price,
                productPriceFormData.storeName,
                new Date()
            );
            await ProductPriceApi.addPriceEntry(productPriceFormData.selectedProduct, priceEntry);
        }
    };

    return (
        <TodoItemListContext.Provider value={{
            todoItems,
            addItem,
            removeItem,
            updateItem,
            toggleItemPurchased,
            updateItemQuantity,
            clearItems,
            submitPriceEntry,
        }}>
            {props.children}
        </TodoItemListContext.Provider>
    );
};

export default TodoItemListContextProvider;
