import { useEffect, useState } from "react";
import StoreApi from "../../../../api/StoreApi";
import { Store } from "../../types";
import GroceriesTodoStoreContext from "./groceries-todo-store-context"

const SELECTED_STORE_KEY = 'userSelectedStoreName'

export const GroceriesTodoStoreContextProvider = (props: React.PropsWithChildren<{}>) => {

    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [stores, setStores] = useState<Store[]>([]);

    useEffect(() => {

        StoreApi.fetchStores()
            .then((stores) => {
                setStores(stores);

                const foundStore = findStoreByName(stores);
                if (foundStore) {
                    setSelectedStore(foundStore);
                }
            });
    }, []);

    const selectStore = (store: Store) => {
        localStorage.setItem(SELECTED_STORE_KEY, store.name);
        setSelectedStore(store);
    }

    const clearSelection = () => {
        localStorage.removeItem(SELECTED_STORE_KEY);
        setSelectedStore(null);
    }

    return (
        <GroceriesTodoStoreContext.Provider value={{
            selectedStore,
            storeList: stores,
            selectStore: selectStore,
            clearSelection: clearSelection
        }}>
            {props.children}
        </GroceriesTodoStoreContext.Provider>
    )
}

function findStoreByName(stores: Store[]) {
    const savedSelectedStoreName = localStorage.getItem(SELECTED_STORE_KEY);
    if (!savedSelectedStoreName) {
        return;
    }

    return stores.find((store) => store.name === savedSelectedStoreName);
}
