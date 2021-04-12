import { useEffect, useState } from "react";
import StoreApi from "../../../../api/StoreApi";
import { Store } from "../../types";
import GroceriesTodoStoreContext from "./groceries-todo-store-context"


export const GroceriesTodoStoreContextProvider = (props: React.PropsWithChildren<{}>) => {

    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [stores, setStores] = useState<Store[]>([]);

    useEffect(() => {
        StoreApi.fetchStores()
            .then(stores => setStores(stores));
    }, []);

    return (
        <GroceriesTodoStoreContext.Provider value={{
            selectedStore,
            storeList: stores,
            selectStore: setSelectedStore,
            clearSelection: () => setSelectedStore(null)
        }}>
            {props.children}
        </GroceriesTodoStoreContext.Provider>
    )
}