import { useState } from "react";
import { Store } from "../../types";
import GroceriesTodoStoreContext from "./groceries-todo-store-context"

const storeNamesList = [
    "Auchan",
    "Lidl",
    "Biedronka",
    "Carrefour",
    "Lewiatan",
    "Zabka",
    "Groszek",
    "Piotr i Paweł",
    "Spar"
];

const defaultStores = storeNamesList.map((storeName, index) => new Store(index, storeName));

export const GroceriesTodoStoreContextProvider = (props: React.PropsWithChildren<{}>) => {

    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [stores, setStores] = useState<Store[]>(defaultStores);


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