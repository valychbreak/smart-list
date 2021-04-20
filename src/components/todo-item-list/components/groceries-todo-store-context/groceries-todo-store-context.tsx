/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Store } from "../../types";

type GroceriesTodoStoreContextType = {
    selectedStore: Store | null;
    storeList: Store[];

    selectStore(store: Store): void;
    clearSelection(): void;
};

const GroceriesTodoStoreContext = React.createContext<GroceriesTodoStoreContextType>({
    selectedStore: null,
    storeList: [],

    selectStore: (store: Store) => {
        throw new Error("No implementation");
    },

    clearSelection: () => {
        throw new Error("No implementation");
    },
});

export default GroceriesTodoStoreContext;
